export const config = {
  port: parseInt(process.env.PORT || "3000"),
  databaseUrl: process.env.DATABASE_URL || "",
  allowedOrigins: process.env.ALLOWED_ORIGINS || "*",
};