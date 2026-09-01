import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VANGUARD Multi-District Rural Service Routing Platform database...");

  // Clean existing tables
  await prisma.requestUpdate.deleteMany();
  await prisma.request.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.volunteerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // ==========================================
  // 1. SUPER ADMIN (System-wide & Multi-District)
  // ==========================================
  const superAdmin = await prisma.user.create({
    data: {
      id: "usr_superadmin_1",
      name: "Officer Rajeshwar Rao",
      phone: "9876543200",
      passwordHash,
      role: "super_admin",
      location: "State Command HQ",
      district: "All Districts",
      language: "en",
      active: true,
    },
  });

  // ==========================================
  // 2. CITIZENS ACROSS MULTIPLE DISTRICTS
  // ==========================================
  const citizenRampur = await prisma.user.create({
    data: {
      id: "usr_citizen_1",
      name: "Ramesh Sharma",
      phone: "9876543210",
      passwordHash,
      role: "citizen",
      location: "Rampur",
      district: "Rampur",
      language: "hi",
      active: true,
    },
  });

  const citizenSitapur = await prisma.user.create({
    data: {
      id: "usr_citizen_2",
      name: "Anandi Patel",
      phone: "9876543220",
      passwordHash,
      role: "citizen",
      location: "Sitapur",
      district: "Sitapur",
      language: "hi",
      active: true,
    },
  });

  const citizenMandya = await prisma.user.create({
    data: {
      id: "usr_citizen_3",
      name: "Basavaraj Gowda",
      phone: "9876543230",
      passwordHash,
      role: "citizen",
      location: "Mandya",
      district: "Mandya",
      language: "kn",
      active: true,
    },
  });

  const citizenShivamogga = await prisma.user.create({
    data: {
      id: "usr_citizen_4",
      name: "Kavitha Hegde",
      phone: "9876543240",
      passwordHash,
      role: "citizen",
      location: "Shivamogga",
      district: "Shivamogga",
      language: "kn",
      active: true,
    },
  });

  // ==========================================
  // 3. WORKERS (Verified & Unverified across trades)
  // ==========================================
  // Rampur Verified Electrician
  const workerRampur1 = await prisma.user.create({
    data: {
      id: "usr_worker_1",
      name: "Sunil Electrician",
      phone: "9876543211",
      passwordHash,
      role: "worker",
      location: "Rampur",
      district: "Rampur",
      language: "hi",
      active: true,
      workerProfile: {
        create: {
          profession: "Electrician",
          availability: true,
          location: "Rampur",
          district: "Rampur",
          latitude: 28.8154,
          longitude: 79.025,
          verified: true,
        },
      },
    },
  });

  // Rampur Unverified Plumber (Gating Demonstration)
  const workerRampur2 = await prisma.user.create({
    data: {
      id: "usr_worker_2",
      name: "Manoj Plumber (Pending Verification)",
      phone: "9876543214",
      passwordHash,
      role: "worker",
      location: "Rampur",
      district: "Rampur",
      language: "hi",
      active: true,
      workerProfile: {
        create: {
          profession: "Plumber",
          availability: true,
          location: "Rampur",
          district: "Rampur",
          latitude: 28.814,
          longitude: 79.024,
          verified: false,
        },
      },
    },
  });

  // Mandya Verified Mason & Canal Technician
  const workerMandya = await prisma.user.create({
    data: {
      id: "usr_worker_3",
      name: "Devraj Mason",
      phone: "9876543216",
      passwordHash,
      role: "worker",
      location: "Mandya",
      district: "Mandya",
      language: "kn",
      active: true,
      workerProfile: {
        create: {
          profession: "Mason & Irrigation Tech",
          availability: true,
          location: "Mandya",
          district: "Mandya",
          latitude: 12.5218,
          longitude: 76.8951,
          verified: true,
        },
      },
    },
  });

  // Shivamogga Verified Solar Pump Specialist
  const workerShivamogga = await prisma.user.create({
    data: {
      id: "usr_worker_4",
      name: "Manjunath Solar",
      phone: "9876543217",
      passwordHash,
      role: "worker",
      location: "Shivamogga",
      district: "Shivamogga",
      language: "kn",
      active: true,
      workerProfile: {
        create: {
          profession: "Solar Pump Specialist",
          availability: true,
          location: "Shivamogga",
          district: "Shivamogga",
          latitude: 13.9299,
          longitude: 75.5681,
          verified: true,
        },
      },
    },
  });

  // Sitapur Unverified Carpenter
  const workerSitapur = await prisma.user.create({
    data: {
      id: "usr_worker_5",
      name: "Ashok Carpenter (Unverified)",
      phone: "9876543219",
      passwordHash,
      role: "worker",
      location: "Sitapur",
      district: "Sitapur",
      language: "hi",
      active: true,
      workerProfile: {
        create: {
          profession: "Carpenter",
          availability: true,
          location: "Sitapur",
          district: "Sitapur",
          latitude: 27.569,
          longitude: 80.684,
          verified: false,
        },
      },
    },
  });

  // ==========================================
  // 4. VOLUNTEERS (Verified & Unverified NGOs)
  // ==========================================
  // Rampur Verified Volunteer (Rural Care NGO)
  const volunteerRampur = await prisma.user.create({
    data: {
      id: "usr_volunteer_1",
      name: "Pooja Volunteer",
      phone: "9876543212",
      passwordHash,
      role: "volunteer",
      location: "Rampur",
      district: "Rampur",
      language: "en",
      active: true,
      volunteerProfile: {
        create: {
          organization: "Rural Care NGO",
          area: "Rampur",
          district: "Rampur",
          latitude: 28.815,
          longitude: 79.027,
          availability: true,
          verified: true,
        },
      },
    },
  });

  // Sitapur Unverified Volunteer (Sitapur Youth Club)
  const volunteerSitapur = await prisma.user.create({
    data: {
      id: "usr_volunteer_2",
      name: "Vikas Volunteer (Pending Verification)",
      phone: "9876543215",
      passwordHash,
      role: "volunteer",
      location: "Sitapur",
      district: "Sitapur",
      language: "hi",
      active: true,
      volunteerProfile: {
        create: {
          organization: "Sitapur Youth Club",
          area: "Sitapur",
          district: "Sitapur",
          latitude: 27.5684,
          longitude: 80.6829,
          availability: true,
          verified: false,
        },
      },
    },
  });

  // Mandya Verified Volunteer (Gram Seva Trust)
  const volunteerMandya = await prisma.user.create({
    data: {
      id: "usr_volunteer_3",
      name: "Chethan Gram Seva",
      phone: "9876543222",
      passwordHash,
      role: "volunteer",
      location: "Mandya",
      district: "Mandya",
      language: "kn",
      active: true,
      volunteerProfile: {
        create: {
          organization: "Gram Seva Trust",
          area: "Mandya",
          district: "Mandya",
          latitude: 12.521,
          longitude: 76.894,
          availability: true,
          verified: true,
        },
      },
    },
  });

  // Shivamogga Verified Volunteer (Red Cross Rural)
  const volunteerShivamogga = await prisma.user.create({
    data: {
      id: "usr_volunteer_4",
      name: "Sowmya Red Cross",
      phone: "9876543223",
      passwordHash,
      role: "volunteer",
      location: "Shivamogga",
      district: "Shivamogga",
      language: "kn",
      active: true,
      volunteerProfile: {
        create: {
          organization: "Red Cross Rural",
          area: "Shivamogga",
          district: "Shivamogga",
          latitude: 13.931,
          longitude: 75.567,
          availability: true,
          verified: true,
        },
      },
    },
  });

  // ==========================================
  // 5. LOCAL AUTHORITIES (Per District)
  // ==========================================
  const authorityRampur = await prisma.user.create({
    data: {
      id: "usr_authority_1",
      name: "Officer Suresh Verma",
      phone: "9876543213",
      passwordHash,
      role: "authority",
      location: "Rampur District Office",
      district: "Rampur",
      language: "en",
      active: true,
    },
  });

  const authorityMandya = await prisma.user.create({
    data: {
      id: "usr_authority_2",
      name: "Officer Mallikarjun Patil",
      phone: "9876543224",
      passwordHash,
      role: "authority",
      location: "Mandya District Panchayat",
      district: "Mandya",
      language: "kn",
      active: true,
    },
  });

  const authorityShivamogga = await prisma.user.create({
    data: {
      id: "usr_authority_3",
      name: "Officer Deepa Rao",
      phone: "9876543225",
      passwordHash,
      role: "authority",
      location: "Shivamogga Municipal Office",
      district: "Shivamogga",
      language: "kn",
      active: true,
    },
  });

  // ==========================================
  // 6. SAMPLE REQUESTS ACROSS LIFECYCLE
  // ==========================================

  // Request 1: In Progress in Rampur (Assigned to Sunil Electrician)
  const req1 = await prisma.request.create({
    data: {
      id: "req_101",
      userId: citizenRampur.id,
      category: "civic",
      description: "Transformer sparking near Ward 4 primary school; power flickering constantly.",
      priority: "medium",
      location: "Rampur",
      district: "Rampur",
      latitude: 28.8154,
      longitude: 79.025,
      status: "in_progress",
      assignedToId: workerRampur1.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4), // 4 hours ago
    },
  });

  await prisma.requestUpdate.createMany({
    data: [
      {
        requestId: req1.id,
        userId: citizenRampur.id,
        message: "Request submitted by citizen Ramesh Sharma.",
        status: "open",
        timestamp: new Date(Date.now() - 3600 * 1000 * 4),
      },
      {
        requestId: req1.id,
        userId: workerRampur1.id,
        message: "Auto-routed and assigned to verified worker Sunil Electrician (Electrician).",
        status: "assigned",
        timestamp: new Date(Date.now() - 3600 * 1000 * 3),
      },
      {
        requestId: req1.id,
        userId: workerRampur1.id,
        message: "Inspection started on site; replacement fuse and cable acquired.",
        status: "in_progress",
        timestamp: new Date(Date.now() - 3600 * 1000 * 1),
      },
    ],
  });

  // Request 2: Open in Sitapur (Unverified personnel only -> Verification Gate Demo)
  const req2 = await prisma.request.create({
    data: {
      id: "req_102",
      userId: citizenSitapur.id,
      category: "farming",
      description: "Irrigation channel breach near south fields, flooding crop seed beds.",
      priority: "low",
      location: "Sitapur",
      district: "Sitapur",
      latitude: 27.5684,
      longitude: 80.6829,
      status: "open",
      assignedToId: null,
      createdAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
    },
  });

  await prisma.requestUpdate.create({
    data: {
      requestId: req2.id,
      userId: citizenSitapur.id,
      message: "Request submitted. No verified available personnel in Sitapur (unverified candidates skipped). Queued for Local Authority triage.",
      status: "open",
      timestamp: new Date(Date.now() - 3600 * 1000 * 2),
    },
  });

  // Request 3: Resolved Emergency in Rampur (Handled by Pooja Volunteer)
  const req3 = await prisma.request.create({
    data: {
      id: "req_103",
      userId: citizenRampur.id,
      category: "emergency",
      description: "Elderly resident requires emergency transport to primary health center.",
      priority: "high",
      location: "Rampur",
      district: "Rampur",
      latitude: 28.8154,
      longitude: 79.025,
      status: "resolved",
      assignedToId: volunteerRampur.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 24), // 24 hours ago
    },
  });

  await prisma.requestUpdate.createMany({
    data: [
      {
        requestId: req3.id,
        userId: citizenRampur.id,
        message: "Emergency request raised by citizen.",
        status: "open",
        timestamp: new Date(Date.now() - 3600 * 1000 * 24),
      },
      {
        requestId: req3.id,
        userId: volunteerRampur.id,
        message: "Auto-routed to verified volunteer Pooja (Rural Care NGO).",
        status: "assigned",
        timestamp: new Date(Date.now() - 3600 * 1000 * 23),
      },
      {
        requestId: req3.id,
        userId: volunteerRampur.id,
        message: "Ambulance coordinated and patient admitted to PHC.",
        status: "resolved",
        timestamp: new Date(Date.now() - 3600 * 1000 * 20),
      },
    ],
  });

  // Request 4: Assigned Farming Request in Mandya (Auto-routed to Devraj Mason)
  const req4 = await prisma.request.create({
    data: {
      id: "req_104",
      userId: citizenMandya.id,
      category: "farming",
      description: "Sugarcane field feeder canal cracked; water escaping into drainage ditch.",
      priority: "low",
      location: "Mandya",
      district: "Mandya",
      latitude: 12.5218,
      longitude: 76.8951,
      status: "assigned",
      assignedToId: workerMandya.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 6),
    },
  });

  await prisma.requestUpdate.createMany({
    data: [
      {
        requestId: req4.id,
        userId: citizenMandya.id,
        message: "Request submitted by Basavaraj Gowda in Mandya.",
        status: "open",
        timestamp: new Date(Date.now() - 3600 * 1000 * 6),
      },
      {
        requestId: req4.id,
        userId: workerMandya.id,
        message: "Auto-routed to verified local worker Devraj Mason (Mason & Irrigation Tech) in Mandya.",
        status: "assigned",
        timestamp: new Date(Date.now() - 3600 * 1000 * 5),
      },
    ],
  });

  // Request 5: In Progress Health Request in Shivamogga (Auto-routed to Sowmya Red Cross)
  const req5 = await prisma.request.create({
    data: {
      id: "req_105",
      userId: citizenShivamogga.id,
      category: "health",
      description: "Maternal checkup assistance and oral rehydration supplies required for newborn ward.",
      priority: "high",
      location: "Shivamogga",
      district: "Shivamogga",
      latitude: 13.9299,
      longitude: 75.5681,
      status: "in_progress",
      assignedToId: volunteerShivamogga.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 8),
    },
  });

  await prisma.requestUpdate.createMany({
    data: [
      {
        requestId: req5.id,
        userId: citizenShivamogga.id,
        message: "Health request raised by Kavitha Hegde.",
        status: "open",
        timestamp: new Date(Date.now() - 3600 * 1000 * 8),
      },
      {
        requestId: req5.id,
        userId: volunteerShivamogga.id,
        message: "Auto-routed to verified volunteer Sowmya Red Cross (Red Cross Rural).",
        status: "assigned",
        timestamp: new Date(Date.now() - 3600 * 1000 * 7),
      },
      {
        requestId: req5.id,
        userId: volunteerShivamogga.id,
        message: "Volunteer dispatched with first aid kit and pediatric oral rehydration packets.",
        status: "in_progress",
        timestamp: new Date(Date.now() - 3600 * 1000 * 3),
      },
    ],
  });

  // Request 6: Open Community Pool Request in Mandya (Available for Volunteers to claim)
  const req6 = await prisma.request.create({
    data: {
      id: "req_106",
      userId: citizenMandya.id,
      category: "other",
      description: "Community hall ceiling fan and wiring assistance for panchayat meeting.",
      priority: "medium",
      location: "Mandya",
      district: "Mandya",
      latitude: 12.5218,
      longitude: 76.8951,
      status: "open",
      assignedToId: null,
      createdAt: new Date(Date.now() - 3600 * 1000 * 12),
    },
  });

  await prisma.requestUpdate.create({
    data: {
      requestId: req6.id,
      userId: citizenMandya.id,
      message: "Request queued in open community pool for volunteer pickup.",
      status: "open",
      timestamp: new Date(Date.now() - 3600 * 1000 * 12),
    },
  });

  console.log("✅ VANGUARD Database seeding completed successfully!");
  console.log("==================================================");
  console.log("🔑 Seeded Demo Credentials (Password: password123):");
  console.log("  Super Admin:         9876543200 (Officer Rajeshwar Rao - State HQ)");
  console.log("  Citizen (Rampur):    9876543210 (Ramesh Sharma)");
  console.log("  Citizen (Mandya):    9876543230 (Basavaraj Gowda)");
  console.log("  Worker (Rampur):     9876543211 (Sunil Electrician - Verified)");
  console.log("  Worker (Mandya):     9876543216 (Devraj Mason - Verified)");
  console.log("  Volunteer (Rampur):  9876543212 (Pooja Volunteer - Verified)");
  console.log("  Volunteer (Shivam.): 9876543223 (Sowmya Red Cross - Verified)");
  console.log("  Authority (Rampur):  9876543213 (Officer Suresh Verma)");
  console.log("  Authority (Mandya):  9876543224 (Officer Mallikarjun Patil)");
  console.log("  Worker (Unverified): 9876543214 (Manoj Plumber - Gated)");
  console.log("  Volunteer (Unver.):  9876543215 (Vikas Volunteer - Gated)");
  console.log("==================================================");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
