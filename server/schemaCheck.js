const db = require('./db');
(async () => {
  try {
    const r = await db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name IN ('enquiries','testimonials','hero_slides') ORDER BY table_name, ordinal_position`);
    console.log(JSON.stringify(r.rows, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('err', e);
    process.exit(1);
  }
})();
