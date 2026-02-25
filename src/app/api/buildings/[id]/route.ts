import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership
    const building = await prisma.building.findFirst({
      where: { id: params.id, userId },
    });

    if (!building) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    // Nullify scans referencing rooms in this building
    await prisma.scan.updateMany({
      where: { room: { buildingId: params.id } },
      data: { roomId: null },
    });

    // Nullify scans referencing this building directly
    await prisma.scan.updateMany({
      where: { buildingId: params.id },
      data: { buildingId: null },
    });

    // Delete building (rooms cascade-delete)
    await prisma.building.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete building error:", error);
    return NextResponse.json(
      { error: "Failed to delete building" },
      { status: 500 }
    );
  }
}
