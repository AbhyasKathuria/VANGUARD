import { hashPassword, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, password, role, location, language = "en", profession, organization, area } = body;

    if (!name || !phone || !password || !role || !location) {
      return NextResponse.json({ error: "Name, phone, password, role, and location are required." }, { status: 400 });
    }

    const validRoles: UserRole[] = ["citizen", "worker", "authority", "volunteer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json({ error: "A user with this phone number already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        passwordHash,
        role,
        language,
        location,
        ...(role === "worker" && {
          workerProfile: {
            create: {
              profession: profession || "General Service",
              location: location,
              availability: true,
              verified: false,
            },
          },
        }),
        ...(role === "volunteer" && {
          volunteerProfile: {
            create: {
              organization: organization || "Community Volunteer",
              area: area || location,
              availability: true,
              verified: false,
            },
          },
        }),
      },
      include: {
        workerProfile: true,
        volunteerProfile: true,
      },
    });

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
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Failed to create account" }, { status: 500 });
  }
}
