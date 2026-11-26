const mysql = require('mysql2/promise');

// Pool de conexões com o banco MySQL criado no script medkit_db.sql
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Altere caso o usuário do MySQL no PC de vocês seja diferente
    password: 'senai',          // Coloque a senha do MySQL de vocês aqui (no XAMPP geralmente é vazio '')
    database: 'medkit_db',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;