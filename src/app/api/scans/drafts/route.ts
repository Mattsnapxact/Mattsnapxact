import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return NextResponse.json(
        { error: "No organisation assigned" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get("buildingId");
    const roomId = searchParams.get("roomId");

    const where: Record<string, unknown> = {
      userId,
      organizationId: orgId,
      status: "draft",
    };

    if (buildingId) where.buildingId = buildingId;
    if (roomId) where.roomId = roomId;

    const scans = await prisma.scan.findMany({
      where,
      include: {
        building: { select: { id: true, name: true } },
        room: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const parsed = scans.map((scan) => ({
      ...scan,
      extraFields: scan.extraFields ? JSON.parse(scan.extraFields) : {},
      buildingName: scan.building?.name || null,
      roomName: scan.room?.name || null,
    }));

    return NextResponse.json({ scans: parsed });
  } catch (error) {
    console.error("Fetch drafts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}
