import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const userId = (session.user as { id: string }).id;

    const buildings = await prisma.building.findMany({
      where: { userId },
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

    const userId = (session.user as { id: string }).id;
    const { name } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Building name is required" },
        { status: 400 }
      );
    }

    const building = await prisma.building.create({
      data: { name: name.trim(), userId },
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
