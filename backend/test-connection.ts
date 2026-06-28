import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Add it to your .env file.');
  process.exit(1);
}

// Parse DATABASE_URL: postgresql://user:password@host:port/database
const url = new URL(DATABASE_URL);
const DB_USER = decodeURIComponent(url.username);
const DB_PASSWORD = decodeURIComponent(url.password);
const DB_HOST = url.hostname;
const DB_PORT = parseInt(url.port || '5432', 10);
const DB_NAME = url.pathname.replace(/^\//, '') || 'postgres';

// Derive Supabase project ID from hostname (pattern: db.<project>.supabase.co)
const projectMatch = DB_HOST.match(/^db\.(.+)\.supabase\.co$/);
const PROJECT = projectMatch ? projectMatch[1] : null;

const configs: any[] = [];

if (PROJECT) {
  // Supabase-specific connection strategies
  const POOLER_HOST = `aws-0-ap-south-1.pooler.supabase.com`;

  configs.push(
    // Direct connection via hostname
    {
      label: 'Direct host (postgres user)',
      host: DB_HOST, port: DB_PORT,
      user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    // Pooler with project-scoped user
    {
      label: 'Pooler (postgres.PROJECT user)',
      host: POOLER_HOST, port: 5432,
      user: `postgres.${PROJECT}`, password: DB_PASSWORD, database: DB_NAME,
      ssl: { rejectUnauthorized: false, servername: POOLER_HOST },
    },
  );
} else {
  // Generic Postgres connection
  configs.push({
    label: 'Direct connection',
    host: DB_HOST, port: DB_PORT,
    user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
    ssl: DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
  });
}

async function main() {
  for (const { label, ...cfg } of configs) {
    process.stdout.write(`Testing: ${label}... `);
    const pool = new Pool({ ...cfg, connectionTimeoutMillis: 10000 });
    try {
      const client = await pool.connect();
      const r = await client.query('SELECT current_database(), version()');
      console.log(`\n✅ SUCCESS! DB=${r.rows[0].current_database}`);
      console.log(`PG: ${r.rows[0].version.split(',')[0]}`);
      client.release();
      await pool.end();
      process.exit(0);
    } catch (e: any) {
      console.log(`❌ ${e.message.replace(/\n/g,' ').slice(0, 100)}`);
      await pool.end().catch(() => {});
    }
  }
  console.log('\n❌ All failed. Check your DATABASE_URL and that the database is running.');
  process.exit(1);
}

main();
