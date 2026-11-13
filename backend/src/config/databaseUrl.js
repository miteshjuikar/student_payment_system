const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const requiredVariables = ["PG_HOST", "PG_DATABASE", "PG_USER"];
  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing PostgreSQL environment variables: ${missingVariables.join(", ")}`
    );
  }

  const url = new URL("postgresql://localhost");
  url.hostname = process.env.PG_HOST;
  url.port = process.env.PG_PORT || "5432";
  url.username = process.env.PG_USER;
  url.password = process.env.PG_PASSWORD || "";
  url.pathname = `/${process.env.PG_DATABASE}`;
  url.searchParams.set("schema", "public");

  return url.toString();
};

module.exports = getDatabaseUrl;
