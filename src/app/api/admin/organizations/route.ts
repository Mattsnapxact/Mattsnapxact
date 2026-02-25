import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const organizations = await prisma.organization.findMany({
      include: {
        _count: { select: { users: true, buildings: true, scans: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("Fetch organizations error:", error);
    return NextResponse.json({ error: "Failed to fetch organisations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Organisation name is required" }, { status: 400 });
    }

    const organization = await prisma.organization.create({
      data: { name: name.trim() },
    });

    return NextResponse.json({ organization }, { status: 201 });
  } catch (error) {
    console.error("Create organization error:", error);
    return NextResponse.json({ error: "Failed to create organisation" }, { status: 500 });
  }
}
