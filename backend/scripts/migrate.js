const path = require("node:path");
const { spawnSync } = require("node:child_process");
const dotenv = require("dotenv");

const backendDirectory = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(backendDirectory, ".env") });

try {
  process.env.DATABASE_URL = require("../src/config/databaseUrl")();

  const migrationArguments = process.argv.slice(2);
  const args =
    migrationArguments.length > 0
      ? migrationArguments
      : ["migrate", "deploy"];

  const result = spawnSync(
    process.execPath,
    [require.resolve("prisma/build/index.js"), ...args],
    {
      cwd: backendDirectory,
      env: process.env,
      stdio: "inherit",
    }
  );

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status === null ? 1 : result.status;
} catch (error) {
  console.error("PostgreSQL migration failed:", error.message);
  process.exitCode = 1;
}
