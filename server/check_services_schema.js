const db = require('./db');
(async () => {
  try {
    const cols = await db.query(`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'services' ORDER BY ordinal_position`);
    console.log('Services table schema:', JSON.stringify(cols.rows, null, 2));
    
    const count = await db.query('SELECT COUNT(*) as count FROM services');
    console.log('Services count:', count.rows[0].count);
    
    const services = await db.query('SELECT id, title, slug FROM services LIMIT 5');
    console.log('Services:', JSON.stringify(services.rows, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
})();

