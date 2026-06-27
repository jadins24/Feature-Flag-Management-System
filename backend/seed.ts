import dotenv from 'dotenv';
dotenv.config();

import { supabase } from './src/config/db';
import { hashPassword } from './src/utils/hash';

async function seed() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    const { data: existing, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (findError) throw findError;

    const passwordHash = await hashPassword(password);

    if (existing) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('id', existing.id);

      if (updateError) throw updateError;
      console.log(`✅ Super admin password reset: ${email}`);
    } else {
      const { error: insertError } = await supabase.from('users').insert({
        email,
        password_hash: passwordHash,
        role: 'super_admin',
        org_id: null,
      });

      if (insertError) throw insertError;
      console.log(`✅ Super admin created: ${email}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
