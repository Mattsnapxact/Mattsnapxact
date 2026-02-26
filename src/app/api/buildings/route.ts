import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
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

    const buildings = await prisma.building.findMany({
      where: { organizationId: orgId },
      include: { rooms: { orderBy: { name: "asc" } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ buildings });
  } catch (error) {
    console.error("Fetch buildings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch buildings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { name } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Building name is required" },
        { status: 400 }
      );
    }

    const building = await prisma.building.create({
      data: { name: name.trim(), userId, organizationId: orgId },
      include: { rooms: true },
    });

    return NextResponse.json({ building }, { status: 201 });
  } catch (error) {
    console.error("Create building error:", error);
    return NextResponse.json(
      { error: "Failed to create building" },
      { status: 500 }
    );
  }
}
