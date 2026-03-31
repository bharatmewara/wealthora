const db=require('./db');
(async() => {
  try {
    const r = await db.query("INSERT INTO services (title,category,description,price,icon,featured) VALUES ('test', 'cat', 'desc', '100', 'icon', true) RETURNING *");
    console.log('ok', r.rows[0]);
  } catch (e) {
    console.error('err', e);
  }
  process.exit(0);
})();
