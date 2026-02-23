import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
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
    const existing = await prisma.scan.findFirst({
      where: { id: params.id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      status,
      manufacturer,
      model,
      serialNumber,
      assetTag,
      extraFields,
      rawText,
    } = body;

    const scan = await prisma.scan.update({
      where: { id: params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(manufacturer !== undefined && { manufacturer }),
        ...(model !== undefined && { model }),
        ...(serialNumber !== undefined && { serialNumber }),
        ...(assetTag !== undefined && { assetTag }),
        ...(extraFields !== undefined && {
          extraFields: JSON.stringify(extraFields),
        }),
        ...(rawText !== undefined && { rawText }),
      },
    });

    return NextResponse.json({ scan });
  } catch (error) {
    console.error("Update scan error:", error);
    return NextResponse.json(
      { error: "Failed to update scan" },
      { status: 500 }
    );
  }
}

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

    const existing = await prisma.scan.findFirst({
      where: { id: params.id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 }
      );
    }

    await prisma.scan.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete scan error:", error);
    return NextResponse.json(
      { error: "Failed to delete scan" },
      { status: 500 }
    );
  }
}
