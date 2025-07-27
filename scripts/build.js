import { execSync } from "child_process";

console.log("🔨 Starting build process for Render...");

try {
  // Install dependencies
  console.log("📦 Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });

  // Generate Prisma client
  console.log("🗄️ Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // Build Next.js application
  console.log("🏗️ Building Next.js application...");
  execSync("npm run build", { stdio: "inherit" });

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
