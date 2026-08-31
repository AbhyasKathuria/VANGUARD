import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const requestItem = await prisma.request.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, phone: true, location: true, role: true },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            workerProfile: true,
            volunteerProfile: true,
          },
        },
        updates: {
          include: {
            user: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!requestItem) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Role-based access control
    if (user.role === "citizen" && requestItem.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You can only view your own requests" }, { status: 403 });
    }

    if (user.role === "worker" && requestItem.assignedToId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You can only view requests assigned to you" }, { status: 403 });
    }

    // Volunteer can view if assigned to them OR if request is currently open
    if (user.role === "volunteer" && requestItem.assignedToId !== user.id && requestItem.status !== "open") {
      return NextResponse.json({ error: "Forbidden: You cannot access this request" }, { status: 403 });
    }

    return NextResponse.json({ request: requestItem });
  } catch (error: any) {
    console.error("Get request by ID error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch request" }, { status: 500 });
  }
}
