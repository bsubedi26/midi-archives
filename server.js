require('babel-register');

require('./server/config/db_config')
  .initDb()
  .then(function() {
    require('./server.babel');
  })
  .catch(function(err) {
    console.error('Failed to open SQLite database:', err);
    process.exit(1);
  });
