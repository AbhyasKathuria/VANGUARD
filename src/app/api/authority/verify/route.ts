import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, role, verified } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "User ID and role are required." }, { status: 400 });
    }

    if (role === "worker") {
      await prisma.workerProfile.update({
        where: { userId },
        data: { verified: Boolean(verified) },
      });
    } else if (role === "volunteer") {
      await prisma.volunteerProfile.update({
        where: { userId },
        data: { verified: Boolean(verified) },
      });
    } else {
      return NextResponse.json({ error: "Invalid role for verification." }, { status: 400 });
    }

    return NextResponse.json({ success: true, verified: Boolean(verified) });
  } catch (error: any) {
    console.error("Verification toggle error:", error);
    return NextResponse.json({ error: error.message || "Failed to update verification status" }, { status: 500 });
  }
}
