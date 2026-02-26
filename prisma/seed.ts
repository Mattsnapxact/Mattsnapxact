import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@snapxact.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`Admin user ${adminEmail} already exists, skipping seed.`);
    return;
  }

  const hashedPassword = await hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
      isAdmin: true,
      isActive: true,
      organizationId: null,
    },
  });

  console.log(`Created admin user: ${admin.email} (id: ${admin.id})`);
  console.log(`Password: ${adminPassword}`);
  console.log("Please change this password after first login.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
