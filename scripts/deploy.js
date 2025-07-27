import { execSync } from "child_process";

console.log("🚀 Starting deployment process...");

try {
  // Generate Prisma client
  console.log("📦 Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // Push database schema
  console.log("🗄️ Pushing database schema...");
  execSync("npx prisma db push", { stdio: "inherit" });

  // Seed database if needed
  console.log("🌱 Seeding database...");
  execSync("npm run db:seed", { stdio: "inherit" });

  console.log("✅ Deployment completed successfully!");
} catch (error) {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
}
