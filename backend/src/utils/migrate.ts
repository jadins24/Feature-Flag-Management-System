import dotenv from 'dotenv';
dotenv.config();

import net from 'net';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

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

  // Strategy 1: Direct connection via DATABASE_URL hostname
  client = await tryConnect('Direct connection (from DATABASE_URL)', {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
  });

  // Strategy 2: Supabase-specific fallback strategies
  if (!client && PROJECT) {
    const POOLER_HOST = 'aws-0-ap-south-1.pooler.supabase.com';

    // Try with project-scoped user on pooler
    client = await tryConnect('Session Pooler (project-scoped user)', {
      host: POOLER_HOST,
      port: 5432,
      user: `postgres.${PROJECT}`,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: { rejectUnauthorized: false },
    });

    if (!client) {
      client = await tryConnect('Transaction Pooler port 6543', {
        host: POOLER_HOST,
        port: 6543,
        user: `postgres.${PROJECT}`,
        password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false },
      });
    }
  }

  if (!client) {
    console.error('\n❌ All connection strategies failed.');
    if (PROJECT) {
      console.error('\n📋 MANUAL OPTION: Run the SQL in the Supabase SQL Editor:');
      console.error(`   https://supabase.com/dashboard/project/${PROJECT}/sql/new`);
      console.error('   Paste contents of: migrations/001_init.sql\n');
    }
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
