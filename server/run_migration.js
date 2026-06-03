const fs = require('fs');
const path = require('path');
const db = require('./db');

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, 'migrations', '002_enterprise_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running enterprise schema migration...');
    await db.query(sql);
    console.log('✅ Enterprise schema migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

runMigration();
