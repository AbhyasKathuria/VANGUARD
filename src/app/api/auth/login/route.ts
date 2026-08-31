import { comparePassword, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone number and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        workerProfile: true,
        volunteerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid phone number or password." }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid phone number or password." }, { status: 401 });
    }

    await setAuthCookie({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role as UserRole,
      location: user.location,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Failed to log in" }, { status: 500 });
  }
}
