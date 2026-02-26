import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { prisma } = await import("@/lib/prisma");

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash("ChangeThisPassword123!", 12);

    const admin = await prisma.user.create({
      data: {
        email: "admin@snapxact.com",
        password: hashedPassword,
        name: "Admin",
        isAdmin: true,
        isActive: true,
        organizationId: null,
      },
    });

    return NextResponse.json({
      success: true,
      email: admin.email,
    });
  } catch (error) {
    console.error("Bootstrap admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
