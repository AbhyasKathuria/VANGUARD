import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Rural Service Routing Platform database...");

  // Clean existing tables
  await prisma.requestUpdate.deleteMany();
  await prisma.request.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.volunteerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Citizen
  const citizen = await prisma.user.create({
    data: {
      id: "usr_citizen_1",
      name: "Ramesh Sharma",
      phone: "9876543210",
      passwordHash,
      role: "citizen",
      location: "Rampur",
      language: "hi",
    },
  });

  // 2. Create Verified Worker (Electrician in Rampur)
  const worker = await prisma.user.create({
    data: {
      id: "usr_worker_1",
      name: "Sunil Electrician",
      phone: "9876543211",
      passwordHash,
      role: "worker",
      location: "Rampur",
      language: "hi",
      workerProfile: {
        create: {
          profession: "Electrician",
          availability: true,
          location: "Rampur",
          verified: true,
        },
      },
    },
  });

  // 3. Create Verified Volunteer (Rural Care NGO in Rampur)
  const volunteer = await prisma.user.create({
    data: {
      id: "usr_volunteer_1",
      name: "Pooja Volunteer",
      phone: "9876543212",
      passwordHash,
      role: "volunteer",
      location: "Rampur",
      language: "en",
      volunteerProfile: {
        create: {
          organization: "Rural Care NGO",
          area: "Rampur",
          availability: true,
          verified: true,
        },
      },
    },
  });

  // 4. Create Local Authority
  const authority = await prisma.user.create({
    data: {
      id: "usr_authority_1",
      name: "Officer Suresh Verma",
      phone: "9876543213",
      passwordHash,
      role: "authority",
      location: "Rampur District Office",
      language: "en",
    },
  });

  // 5. Create UNVERIFIED Worker (Plumber in Rampur) - Gated by Routing Engine
  const unverifiedWorker = await prisma.user.create({
    data: {
      id: "usr_worker_2",
      name: "Manoj Plumber (Pending Verification)",
      phone: "9876543214",
      passwordHash,
      role: "worker",
      location: "Rampur",
      language: "hi",
      workerProfile: {
        create: {
          profession: "Plumber",
          availability: true,
          location: "Rampur",
          verified: false,
        },
      },
    },
  });

  // 6. Create UNVERIFIED Volunteer (Sitapur Youth Club) - Gated by Routing Engine
  const unverifiedVolunteer = await prisma.user.create({
    data: {
      id: "usr_volunteer_2",
      name: "Vikas Volunteer (Pending Verification)",
      phone: "9876543215",
      passwordHash,
      role: "volunteer",
      location: "Sitapur",
      language: "hi",
      volunteerProfile: {
        create: {
          organization: "Sitapur Youth Club",
          area: "Sitapur",
          availability: true,
          verified: false,
        },
      },
    },
  });

  // 7. Seed Sample Requests with Full Status Update Histories

  // Request 1: In Progress (Assigned to Verified Worker Sunil)
  const req1 = await prisma.request.create({
    data: {
      id: "req_101",
      userId: citizen.id,
      category: "civic",
      description: "Transformer sparking near Ward 4 primary school; power flickering constantly.",
      priority: "medium",
      location: "Rampur",
      status: "in_progress",
      assignedToId: worker.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4), // 4 hours ago
    },
  });

  await prisma.requestUpdate.createMany({
    data: [
      {
        requestId: req1.id,
        userId: citizen.id,
        message: "Request submitted by citizen Ramesh Sharma.",
        status: "open",
        timestamp: new Date(Date.now() - 3600 * 1000 * 4),
      },
      {
        requestId: req1.id,
        userId: worker.id,
        message: "Auto-routed and assigned to verified worker Sunil Electrician (Electrician).",
        status: "assigned",
        timestamp: new Date(Date.now() - 3600 * 1000 * 3),
      },
      {
        requestId: req1.id,
        userId: worker.id,
        message: "Inspection started on site; replacement fuse and cable acquired.",
        status: "in_progress",
        timestamp: new Date(Date.now() - 3600 * 1000 * 1),
      },
    ],
  });

  // Request 2: Open (In Sitapur where only unverified personnel exist - Demonstrates Gating!)
  const req2 = await prisma.request.create({
    data: {
      id: "req_102",
      userId: citizen.id,
      category: "farming",
      description: "Irrigation channel breach near south fields, flooding crop seed beds.",
      priority: "low",
      location: "Sitapur",
      status: "open",
      assignedToId: null,
      createdAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
    },
  });

  await prisma.requestUpdate.create({
    data: {
      requestId: req2.id,
      userId: citizen.id,
      message: "Request submitted. No verified available personnel in Sitapur (unverified candidates skipped). Queued for Local Authority triage.",
      status: "open",
      timestamp: new Date(Date.now() - 3600 * 1000 * 2),
    },
  });

  // Request 3: Resolved (Emergency handled by Verified Volunteer Pooja)
  const req3 = await prisma.request.create({
    data: {
      id: "req_103",
      userId: citizen.id,
      category: "emergency",
      description: "Elderly resident requires emergency transport to primary health center.",
      priority: "high",
      location: "Rampur",
      status: "resolved",
      assignedToId: volunteer.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 24), // 24 hours ago
    },
  });

  await prisma.requestUpdate.createMany({
    data: [
      {
        requestId: req3.id,
        userId: citizen.id,
        message: "Emergency request raised by citizen.",
        status: "open",
        timestamp: new Date(Date.now() - 3600 * 1000 * 24),
      },
      {
        requestId: req3.id,
        userId: volunteer.id,
        message: "Auto-routed to verified volunteer Pooja (Rural Care NGO).",
        status: "assigned",
        timestamp: new Date(Date.now() - 3600 * 1000 * 23),
      },
      {
        requestId: req3.id,
        userId: volunteer.id,
        message: "Ambulance coordinated and patient admitted to PHC.",
        status: "resolved",
        timestamp: new Date(Date.now() - 3600 * 1000 * 20),
      },
    ],
  });

  console.log("✅ Seeding completed successfully!");
  console.log("-----------------------------------------");
  console.log("Demo Credentials (Password: password123):");
  console.log("  Citizen:             9876543210 (Ramesh Sharma)");
  console.log("  Worker (Verified):   9876543211 (Sunil Electrician)");
  console.log("  Volunteer (Verified):9876543212 (Pooja Volunteer)");
  console.log("  Local Authority:     9876543213 (Officer Suresh Verma)");
  console.log("  Worker (Unverified): 9876543214 (Manoj Plumber - Gated)");
  console.log("  Volunteer (Unver.):  9876543215 (Vikas Volunteer - Gated)");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
