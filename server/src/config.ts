import "dotenv/config";

const requiredEnvs = ["DATABASE_URL", "JWT_SECRET"];
for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.warn(`⚠ Missing env: ${env}. Using defaults for development.`);
  }
}

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
