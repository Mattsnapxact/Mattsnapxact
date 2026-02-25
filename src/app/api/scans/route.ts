import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required to save scans" },
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
    const body = await request.json();

    // Validate buildingId belongs to this organisation
    if (body.buildingId) {
      const building = await prisma.building.findFirst({
        where: { id: body.buildingId, organizationId: orgId },
      });
      if (!building) {
        return NextResponse.json(
          { error: "Building not found" },
          { status: 403 }
        );
      }
    }

    // Validate roomId belongs to this organisation
    if (body.roomId) {
      const room = await prisma.room.findFirst({
        where: { id: body.roomId, organizationId: orgId },
      });
      if (!room) {
        return NextResponse.json(
          { error: "Room not found" },
          { status: 403 }
        );
      }
    }

    const scan = await prisma.scan.create({
      data: {
        userId,
        organizationId: orgId,
        status: body.status || "draft",
        manufacturer: body.manufacturer || null,
        model: body.model || null,
        serialNumber: body.serialNumber || null,
        assetTag: body.assetTag || null,
        extraFields: body.extraFields
          ? JSON.stringify(body.extraFields)
          : null,
        rawText: body.rawText || null,
        buildingId: body.buildingId || null,
        roomId: body.roomId || null,
        batchId: body.batchId || null,
      },
    });

    return NextResponse.json({ scan }, { status: 201 });
  } catch (error) {
    console.error("Save scan error:", error);
    return NextResponse.json(
      { error: "Failed to save scan" },
      { status: 500 }
    );
  }
}

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
    const statusFilter = searchParams.get("status");

    const where: Record<string, unknown> = { userId, organizationId: orgId };
    if (statusFilter) where.status = statusFilter;

    const scans = await prisma.scan.findMany({
      where,
      include: {
        building: { select: { id: true, name: true } },
        room: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const parsed = scans.map((scan) => ({
      ...scan,
      extraFields: scan.extraFields ? JSON.parse(scan.extraFields) : {},
      buildingName: scan.building?.name || null,
      roomName: scan.room?.name || null,
    }));

    return NextResponse.json({ scans: parsed });
  } catch (error) {
    console.error("Fetch scans error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scans" },
      { status: 500 }
    );
  }
}
