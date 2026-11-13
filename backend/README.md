# Backend

## PostgreSQL and Prisma

The backend uses Prisma to store transaction audit records in PostgreSQL. Set
`PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, and `PG_PASSWORD` in `.env`.
Alternatively, provide a standard Prisma `DATABASE_URL`.

The PostgreSQL database must exist before starting the backend. `npm start` and
`npm run dev` apply committed Prisma migrations before launching the server, so
the `transaction_logs` table is created automatically when the database is
first initialized.

Useful commands, run from this directory:

- `npm run db:migrate` applies committed migrations.
- `npm run db:migrate:dev` creates and applies a migration during development.
- `npm run db:generate` regenerates the Prisma Client after schema changes.
