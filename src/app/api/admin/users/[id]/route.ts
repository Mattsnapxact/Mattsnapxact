import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hash } from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { action, newPassword } = body;

    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from disabling themselves
    if (action === "disable" && params.id === session.user.id) {
      return NextResponse.json({ error: "Cannot disable your own account" }, { status: 400 });
    }

    if (action === "disable") {
      await prisma.user.update({
        where: { id: params.id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, message: "User disabled" });
    }

    if (action === "enable") {
      await prisma.user.update({
        where: { id: params.id },
        data: { isActive: true },
      });
      return NextResponse.json({ success: true, message: "User enabled" });
    }

    if (action === "resetPassword") {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      const hashedPassword = await hash(newPassword, 12);
      await prisma.user.update({
        where: { id: params.id },
        data: { password: hashedPassword },
      });
      return NextResponse.json({ success: true, message: "Password reset successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
