import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ duplicate: null });
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return NextResponse.json({ duplicate: null });
    }

    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get("serialNumber");

    if (!serialNumber || !serialNumber.trim()) {
      return NextResponse.json({ duplicate: null });
    }

    const existing = await prisma.scan.findFirst({
      where: {
        organizationId: orgId,
        serialNumber: serialNumber.trim(),
      },
      include: {
        building: { select: { name: true } },
        room: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!existing) {
      return NextResponse.json({ duplicate: null });
    }

    return NextResponse.json({
      duplicate: {
        id: existing.id,
        serialNumber: existing.serialNumber,
        buildingName: existing.building?.name || null,
        roomName: existing.room?.name || null,
        status: existing.status,
        createdAt: existing.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Check duplicate error:", error);
    return NextResponse.json({ duplicate: null });
  }
}
