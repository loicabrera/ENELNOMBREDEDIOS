// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nashla11',
  database: 'suplidoresevent'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

export.module  = db;
