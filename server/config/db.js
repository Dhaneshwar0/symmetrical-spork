const { Pool } = require('pg');

// WARNING: It is recommended to use environment variables for database credentials
// instead of hardcoding them in the source code.
const pool = new Pool({
  user: 'db_user',
  host: 'localhost',
  database: 'rapido_clone_db',
  password: 'db_password',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
