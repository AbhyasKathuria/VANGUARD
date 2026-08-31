import { prisma } from "../src/lib/prisma";
import { determineRoutingAndAssignment, getCategoryDefaultPriority } from "../src/lib/routing";

async function runTests() {
  console.log("==================================================");
  console.log("🧪 RUNNING RURAL SERVICE ROUTING E2E INTEGRATION TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST 1: Category -> Priority Mapping
  console.log("\n[Test Suite 1: Priority Mapping]");
  assert(getCategoryDefaultPriority("emergency") === "high", "Emergency maps to HIGH priority");
  assert(getCategoryDefaultPriority("health") === "high", "Health maps to HIGH priority");
  assert(getCategoryDefaultPriority("civic") === "medium", "Civic maps to MEDIUM priority");
  assert(getCategoryDefaultPriority("farming") === "low", "Farming maps to LOW priority");
  assert(getCategoryDefaultPriority("other") === "medium", "Other maps to MEDIUM priority");

  // TEST 2: Verified Worker Auto-Routing in Rampur
  console.log("\n[Test Suite 2: Verified Worker Auto-Routing]");
  const workerMatch = await determineRoutingAndAssignment("civic", "Rampur", "Broken wire near school");
  assert(workerMatch.status === "assigned", "Civic issue in Rampur is assigned");
  assert(workerMatch.assignedToId === "usr_worker_1", "Assigned to verified Sunil Electrician (usr_worker_1)");
  assert(workerMatch.auditMessage.includes("Sunil Electrician"), "Audit message contains worker name");

  // TEST 3: Verification Gate Test (Unverified candidates must NOT be matched)
  console.log("\n[Test Suite 3: Verification Gate Test - Unverified candidates ignored]");
  // Manoj Plumber is in Rampur, but verified: false.
  // Vikas Volunteer is in Sitapur, but verified: false.
  const unverifiedGateMatch = await determineRoutingAndAssignment("civic", "Sitapur", "Water leak in village hall");
  assert(
    unverifiedGateMatch.status === "open",
    "Routing engine skips unverified candidates (Vikas Volunteer) in Sitapur -> stays OPEN"
  );
  assert(unverifiedGateMatch.assignedToId === null, "AssignedTo is null when only unverified candidates exist");
  assert(
    unverifiedGateMatch.auditMessage.includes("Queued for Local Authority"),
    "Queued for Authority review when no verified candidates exist"
  );

  // TEST 4: Verification Toggle Effect (Verify Sitapur Volunteer -> auto-match succeeds)
  console.log("\n[Test Suite 4: Authority Verification Dynamic Effect]");
  // Authority verifies Vikas Volunteer
  await prisma.volunteerProfile.update({
    where: { userId: "usr_volunteer_2" },
    data: { verified: true },
  });

  const verifiedMatchAfterToggle = await determineRoutingAndAssignment("emergency", "Sitapur", "Urgent first aid");
  assert(
    verifiedMatchAfterToggle.status === "assigned",
    "After Authority verification, Sitapur request is now ASSIGNED"
  );
  assert(
    verifiedMatchAfterToggle.assignedToId === "usr_volunteer_2",
    "Assigned to newly verified volunteer Vikas (usr_volunteer_2)"
  );

  // Reset back to unverified for test consistency
  await prisma.volunteerProfile.update({
    where: { userId: "usr_volunteer_2" },
    data: { verified: false },
  });

  // TEST 5: Complete Request Lifecycle with Updates & Helper Profile Trust
  console.log("\n[Test Suite 5: Complete Request Lifecycle & Helper Profile Exposure]");
  const citizen = await prisma.user.findUnique({ where: { phone: "9876543210" } });
  const worker = await prisma.user.findUnique({
    where: { phone: "9876543211" },
    include: { workerProfile: true },
  });

  if (!citizen || !worker) {
    console.error("Seed users not found!");
    process.exit(1);
  }

  // Create
  const testReq = await prisma.request.create({
    data: {
      userId: citizen.id,
      category: "civic",
      description: "Transformer sparking on pole 14",
      priority: "medium",
      location: "Rampur",
      status: workerMatch.status,
      assignedToId: workerMatch.assignedToId,
      updates: {
        create: [
          {
            userId: citizen.id,
            message: "Request raised by citizen.",
            status: "open",
          },
          {
            userId: worker.id,
            message: workerMatch.auditMessage,
            status: "assigned",
          },
        ],
      },
    },
    include: {
      assignedTo: {
        include: { workerProfile: true, volunteerProfile: true },
      },
      updates: true,
    },
  });

  assert(testReq.status === "assigned", "New request created as ASSIGNED");
  assert(testReq.assignedTo?.name === "Sunil Electrician", "Helper name is exposed as 'Sunil Electrician'");
  assert(testReq.assignedTo?.role === "worker", "Helper role is exposed as 'worker'");
  assert(
    testReq.assignedTo?.workerProfile?.profession === "Electrician",
    "Helper profession is exposed as 'Electrician'"
  );
  assert(testReq.assignedTo?.phone === "9876543211", "Helper contact is exposed");

  // Update to In Progress
  const inProgReq = await prisma.request.update({
    where: { id: testReq.id },
    data: {
      status: "in_progress",
      updates: {
        create: {
          userId: worker.id,
          status: "in_progress",
          message: "Worker arrived at site with toolset.",
        },
      },
    },
    include: { updates: true },
  });
  assert(inProgReq.status === "in_progress", "Status updated to IN_PROGRESS");

  // Update to Resolved
  const resReq = await prisma.request.update({
    where: { id: testReq.id },
    data: {
      status: "resolved",
      updates: {
        create: {
          userId: worker.id,
          status: "resolved",
          message: "Wiring replaced and tested. Safe.",
        },
      },
    },
    include: { updates: { orderBy: { timestamp: "asc" } } },
  });
  assert(resReq.status === "resolved", "Status updated to RESOLVED");
  assert(resReq.updates.length === 4, "4 chronological audit updates recorded");

  // Clean up test request
  await prisma.requestUpdate.deleteMany({ where: { requestId: testReq.id } });
  await prisma.request.delete({ where: { id: testReq.id } });

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
