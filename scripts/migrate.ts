import { config } from "dotenv";
import { neon } from '@neondatabase/serverless';

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    console.log('Running migration...');
    
    // Run each ALTER TABLE statement separately
    await sql`ALTER TABLE ideal_self ADD COLUMN IF NOT EXISTS priority_areas JSONB`;
    await sql`ALTER TABLE ideal_self ADD COLUMN IF NOT EXISTS financial_vision TEXT`;
    await sql`ALTER TABLE ideal_self ADD COLUMN IF NOT EXISTS health_vision TEXT`;
    await sql`ALTER TABLE ideal_self ADD COLUMN IF NOT EXISTS signature_habits JSONB`;
    await sql`ALTER TABLE ideal_self ADD COLUMN IF NOT EXISTS constraints TEXT`;
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
