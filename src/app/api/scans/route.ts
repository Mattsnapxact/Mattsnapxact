import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required to save scans" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { scans, batchId } = body;

    if (!scans || !Array.isArray(scans)) {
      return NextResponse.json(
        { error: "Scans array is required" },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const savedScans = await prisma.$transaction(
      scans.map((scan: {
        manufacturer?: string;
        model?: string;
        serialNumber?: string;
        assetTag?: string;
        extraFields?: Record<string, string>;
        rawText?: string;
        buildingId?: string;
        roomId?: string;
      }) =>
        prisma.scan.create({
          data: {
            userId,
            batchId: batchId || null,
            manufacturer: scan.manufacturer || null,
            model: scan.model || null,
            serialNumber: scan.serialNumber || null,
            assetTag: scan.assetTag || null,
            extraFields: scan.extraFields
              ? JSON.stringify(scan.extraFields)
              : null,
            rawText: scan.rawText || null,
            buildingId: scan.buildingId || null,
            roomId: scan.roomId || null,
          },
        })
      )
    );

    return NextResponse.json({ scans: savedScans }, { status: 201 });
  } catch (error) {
    console.error("Save scans error:", error);
    return NextResponse.json(
      { error: "Failed to save scans" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const scans = await prisma.scan.findMany({
      where: { userId },
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
