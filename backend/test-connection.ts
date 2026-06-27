import { Pool } from 'pg';

const PROJECT = 'jnazyxwmacujvetnaagy';
const PASSWORD = '8Y3w9jcwPXqfOXk0';

// Pre-resolved IPs for the pooler regions
const POOLER_IP = '3.108.251.216'; // ap-south-1
const POOLER_HOST = `aws-0-ap-south-1.pooler.supabase.com`;

const configs: any[] = [
  // IPv6 direct (Google DoH resolved)
  {
    label: 'Direct IPv6 (postgres user)',
    host: '2406:da14:25a:5801:ba33:64cd:60d4:f650', port: 5432,
    user: 'postgres', password: PASSWORD, database: 'postgres',
    ssl: { rejectUnauthorized: false },
  },
  {
    label: 'Direct IPv6 (postgres.PROJECT user)',
    host: '2406:da14:25a:5801:ba33:64cd:60d4:f650', port: 5432,
    user: `postgres.${PROJECT}`, password: PASSWORD, database: 'postgres',
    ssl: { rejectUnauthorized: false },
  },
  // Try plain 'postgres' user on pooler (older Supabase projects)
  {
    label: 'Pooler with user=postgres (old format)',
    host: '3.108.251.216', port: 5432,
    user: 'postgres', password: PASSWORD, database: 'postgres',
    ssl: { rejectUnauthorized: false, servername: POOLER_HOST },
  },
  // Try with project.user format
  {
    label: 'Pooler user=postgres.PROJECT (new format)',
    host: '3.108.251.216', port: 5432,
    user: `postgres.${PROJECT}`, password: PASSWORD, database: 'postgres',
    ssl: { rejectUnauthorized: false, servername: POOLER_HOST },
  },
  // Direct connection via hostname (may fail if local DNS is broken)
  {
    label: 'Direct host (hostname, plain postgres user)',
    host: `db.${PROJECT}.supabase.co`, port: 5432,
    user: 'postgres', password: PASSWORD, database: 'postgres',
    ssl: { rejectUnauthorized: false },
  },
];

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
  console.log('\n❌ All failed. The project may be paused — check supabase.com/dashboard');
  process.exit(1);
}

main();
