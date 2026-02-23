import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const userId = (session.user as { id: string }).id;
    const body = await request.json();

    // Single scan auto-save
    const scan = await prisma.scan.create({
      data: {
        userId,
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

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status"); // "draft", "confirmed", or null (all)

    const where: Record<string, unknown> = { userId };
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
