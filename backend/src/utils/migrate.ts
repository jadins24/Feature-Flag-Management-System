import dotenv from 'dotenv';
dotenv.config();

import net from 'net';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const PROJECT = 'jnazyxwmacujvetnaagy';
const PASSWORD = '8Y3w9jcwPXqfOXk0';

// Custom socket that redirects TCP to a pre-resolved IP (bypasses Node DNS)
function makeRedirectedSocket(realIp: string, realPort: number): net.Socket {
  const socket = new net.Socket();
  const origConnect = socket.connect.bind(socket);
  // Override connect() so pg's DNS call is bypassed
  (socket as any).connect = (_port: any, _host: any, cb?: () => void) => {
    console.log(`   [DNS bypass] Redirecting ${_host}:${_port} → ${realIp}:${realPort}`);
    return origConnect(realPort, realIp, cb);
  };
  return socket;
}

async function tryConnect(label: string, cfg: any): Promise<Client | null> {
  console.log(`\n🔌 Trying: ${label}`);
  const client = new Client({ ...cfg, connectionTimeoutMillis: 15000 });
  try {
    await client.connect();
    const res = await client.query('SELECT current_database()');
    console.log(`✅ Connected! DB: ${res.rows[0].current_database}`);
    return client;
  } catch (err: any) {
    console.log(`   ❌ ${err.message.replace(/\n/g, ' ').slice(0, 120)}`);
    await client.end().catch(() => {});
    return null;
  }
}

async function migrate() {
  console.log('\n🚀 Feature Flag Management System — DB Migration\n');

  let client: Client | null = null;

  // Strategy 1: IPv6 direct connection (resolved via DoH, bypass local DNS)
  const IPV6 = '2406:da14:25a:5801:ba33:64cd:60d4:f650';
  const DIRECT = 'db.jnazyxwmacujvetnaagy.supabase.co';

  client = await tryConnect('Direct IPv6 (postgres user, port 5432)', {
    host: IPV6,
    port: 5432,
    user: 'postgres',
    password: PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  if (!client) {
    client = await tryConnect('Direct IPv6 (postgres.PROJECT user)', {
      host: IPV6,
      port: 5432,
      user: `postgres.${PROJECT}`,
      password: PASSWORD,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
    });
  }

  if (!client) {
    client = await tryConnect('Direct IPv6 via hostname (TLS SNI)', {
      host: DIRECT,
      port: 5432,
      user: 'postgres',
      password: PASSWORD,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      stream: makeRedirectedSocket(IPV6, 5432),
    });
  }

  if (!client) {
    // Strategy 2: Session Pooler via pre-resolved IP + SNI
    const POOLER_HOST = 'aws-0-ap-south-1.pooler.supabase.com';
    const POOLER_IP   = '3.108.251.216';

    client = await tryConnect('Session Pooler (pre-resolved IP, custom socket)', {
      host: POOLER_HOST,
      port: 5432,
      user: `postgres.${PROJECT}`,
      password: PASSWORD,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      stream: makeRedirectedSocket(POOLER_IP, 5432),
    });
  }

  if (!client) {
    client = await tryConnect('Transaction Pooler port 6543 (pre-resolved IP)', {
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 6543,
      user: `postgres.${PROJECT}`,
      password: PASSWORD,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      stream: makeRedirectedSocket('3.108.251.216', 6543),
    });
  }

  if (!client) {
    console.error('\n❌ All connection strategies failed.');
    console.error('\n📋 MANUAL OPTION: Run the SQL in the Supabase SQL Editor:');
    console.error('   https://supabase.com/dashboard/project/jnazyxwmacujvetnaagy/sql/new');
    console.error('   Paste contents of: migrations/001_init.sql\n');
    process.exit(1);
  }

  // Run migration
  try {
    const sqlPath = path.join(__dirname, '../../migrations/001_init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    console.log('\n📦 Running migration: 001_init.sql ...');
    await client.query(sql);
    console.log('✅ Migration complete!');
    console.log('   Tables created: organizations, users, feature_flags');
    await client.end();
    process.exit(0);
  } catch (err: any) {
    console.error(`❌ Migration SQL error: ${err.message}`);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

migrate();
