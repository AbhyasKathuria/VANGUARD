import { prisma } from "./prisma";
import { RequestCategory, RequestPriority } from "./types";

export function getCategoryDefaultPriority(category: RequestCategory): RequestPriority {
  switch (category) {
    case "emergency":
    case "health":
      return "high";
    case "civic":
    case "other":
      return "medium";
    case "farming":
      return "low";
    default:
      return "medium";
  }
}

export interface RoutingMatchResult {
  assignedToId: string | null;
  status: "assigned" | "open";
  auditMessage: string;
  matchedPersonnelName?: string;
  matchedRole?: string;
}

/**
 * Deterministic Rule-Based Routing Algorithm
 * 1. Matches category to default priority
 * 2. Queries available & verified workers/volunteers matching location
 * 3. Assigns or queues for manual Local Authority review
 */
export async function determineRoutingAndAssignment(
  category: RequestCategory,
  location: string,
  description: string
): Promise<RoutingMatchResult> {
  const normLocation = location.trim().toLowerCase();

  // 1. If Civic / Health / Farming, check Workers first
  if (category === "civic" || category === "health" || category === "farming") {
    const candidateWorkers = await prisma.workerProfile.findMany({
      where: {
        availability: true,
        verified: true,
      },
      include: {
        user: true,
      },
    });

    // Match worker by location (exact or contains)
    const matchedWorker = candidateWorkers.find((w) => {
      const workerLoc = w.location.trim().toLowerCase();
      return workerLoc === normLocation || workerLoc.includes(normLocation) || normLocation.includes(workerLoc);
    });

    if (matchedWorker) {
      return {
        assignedToId: matchedWorker.userId,
        status: "assigned",
        matchedPersonnelName: matchedWorker.user.name,
        matchedRole: `Worker (${matchedWorker.profession})`,
        auditMessage: `Auto-routed to verified local worker ${matchedWorker.user.name} (${matchedWorker.profession}) in ${matchedWorker.location}.`,
      };
    }
  }

  // 2. If Emergency, Other, or no worker found: check Volunteers
  const candidateVolunteers = await prisma.volunteerProfile.findMany({
    where: {
      availability: true,
      verified: true,
    },
    include: {
      user: true,
    },
  });

  const matchedVolunteer = candidateVolunteers.find((v) => {
    const volArea = v.area.trim().toLowerCase();
    return volArea === normLocation || volArea.includes(normLocation) || normLocation.includes(volArea);
  });

  if (matchedVolunteer) {
    return {
      assignedToId: matchedVolunteer.userId,
      status: "assigned",
      matchedPersonnelName: matchedVolunteer.user.name,
      matchedRole: `Volunteer (${matchedVolunteer.organization})`,
      auditMessage: `Auto-routed to verified local volunteer ${matchedVolunteer.user.name} (${matchedVolunteer.organization}) for area ${matchedVolunteer.area}.`,
    };
  }

  // 3. Fallback: Queue for Local Authority triage
  return {
    assignedToId: null,
    status: "open",
    auditMessage: `Request submitted. No immediate available personnel found in "${location}". Queued for Local Authority review and manual dispatch.`,
  };
}
