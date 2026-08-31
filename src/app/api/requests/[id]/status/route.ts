import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@/lib/types";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, message, action } = body;

    const existingRequest = await prisma.request.findUnique({
      where: { id },
      include: { assignedTo: true },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // 1. Special Case: Volunteer Claiming an Open Request
    if (action === "claim" && user.role === "volunteer") {
      if (existingRequest.status !== "open") {
        return NextResponse.json({ error: "This request is no longer open for claiming." }, { status: 400 });
      }

      const updated = await prisma.request.update({
        where: { id },
        data: {
          status: "assigned",
          assignedToId: user.id,
          updates: {
            create: {
              userId: user.id,
              status: "assigned",
              message: message || `Claimed by volunteer ${user.name} (${user.volunteerProfile?.organization || "Volunteer"}).`,
            },
          },
        },
        include: { updates: true, assignedTo: true },
      });

      return NextResponse.json({ success: true, request: updated });
    }

    // 2. Standard Status Updates (in_progress, resolved)
    const validStatuses: RequestStatus[] = ["open", "assigned", "in_progress", "resolved"];
    if (!status || !validStatuses.includes(status as RequestStatus)) {
      return NextResponse.json({ error: "Invalid status provided." }, { status: 400 });
    }

    // Permission check: Authority or assigned worker/volunteer
    const isAssigned = existingRequest.assignedToId === user.id;
    const isAuthority = user.role === "authority";

    if (!isAssigned && !isAuthority) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to update the status of this request." },
        { status: 403 }
      );
    }

    const defaultMsg =
      status === "in_progress"
        ? `Status changed to IN PROGRESS by ${user.name} (${user.role}).`
        : status === "resolved"
        ? `Status marked as RESOLVED by ${user.name} (${user.role}).`
        : `Status updated to ${status.toUpperCase()} by ${user.name}.`;

    const updated = await prisma.request.update({
      where: { id },
      data: {
        status,
        updates: {
          create: {
            userId: user.id,
            status,
            message: message || defaultMsg,
          },
        },
      },
      include: {
        updates: {
          orderBy: { timestamp: "asc" },
        },
        assignedTo: true,
      },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
  }
}
