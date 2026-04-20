const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DEMO_USER = {
  username: 'demo',
  email: 'demo@midiarchives.local',
  password: 'demo-password',
  favoriteMidis: [
    'Lady_Gaga-Poker_Face.mid',
    'Mission_Impossible.mid',
    'hyrule_temple_theme.mid',
    'Jamaica.mid'
  ]
};

let db;
let dbPath;

function persist() {
  if (!db || !dbPath) return;
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function queryOne(sql, params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (!stmt.step()) {
    stmt.free();
    return null;
  }
  const row = stmt.getAsObject();
  stmt.free();
  return row;
}

function rowToUser(row) {
  if (!row) return null;
  const u = {
    id: row.id,
    _id: row.id,
    username: row.username,
    password: row.password,
    email: row.email
  };
  if (row.favoriteMidis) {
    try {
      u.favoriteMidis = JSON.parse(row.favoriteMidis);
    } catch (e) {
      u.favoriteMidis = [];
    }
  } else {
    u.favoriteMidis = [];
  }
  return u;
}

function getUserById(id) {
  const idNum = typeof id === 'number' ? id : parseInt(String(id), 10);
  if (Number.isNaN(idNum)) return null;
  const row = queryOne('SELECT * FROM user WHERE id = ?', [idNum]);
  return rowToUser(row);
}

function getUserByUsername(username) {
  const row = queryOne('SELECT * FROM user WHERE username = ?', [username]);
  return rowToUser(row);
}

function getUserByEmail(email) {
  const row = queryOne('SELECT * FROM user WHERE email = ?', [email]);
  return rowToUser(row);
}

function createUser(username, passwordHash, email) {
  db.run('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [
    username,
    passwordHash,
    email
  ]);
  persist();
  const r = db.exec('SELECT last_insert_rowid() AS id');
  const newId = r[0].values[0][0];
  return getUserById(newId);
}

function ensureDemoUser() {
  const existingDemo = getUserByUsername(DEMO_USER.username);

  if (existingDemo) {
    if (!existingDemo.favoriteMidis || existingDemo.favoriteMidis.length === 0) {
      setFavoriteMidis(DEMO_USER.username, DEMO_USER.favoriteMidis);
    }
    return existingDemo;
  }

  const passwordHash = bcrypt.hashSync(DEMO_USER.password, 10);
  const demoUser = createUser(DEMO_USER.username, passwordHash, DEMO_USER.email);
  setFavoriteMidis(DEMO_USER.username, DEMO_USER.favoriteMidis);

  return demoUser;
}

function setFavoriteMidis(username, favorites) {
  const json = JSON.stringify(favorites);
  db.run('UPDATE user SET favoriteMidis = ? WHERE username = ?', [json, username]);
  persist();
}

function initDb() {
  return initSqlJs().then(function(SQL) {
    dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'app.db');
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    if (fs.existsSync(dbPath)) {
      db = new SQL.Database(new Uint8Array(fs.readFileSync(dbPath)));
    } else {
      db = new SQL.Database();
    }
    db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        favoriteMidis TEXT
      );
    `);
    ensureDemoUser();
    persist();
  });
}

module.exports = {
  initDb,
  DEMO_USER,
  rowToUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  ensureDemoUser,
  setFavoriteMidis
};
