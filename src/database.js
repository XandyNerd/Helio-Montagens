const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/Connect to database
const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Initialize tables
db.serialize(() => {
    // Table: agendamentos
    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cliente TEXT NOT NULL,
        telefone TEXT NOT NULL,
        endereco TEXT NOT NULL,
        bairro TEXT,
        data_agendamento TEXT NOT NULL,
        horario_agendamento TEXT NOT NULL,
        tipo_servico TEXT NOT NULL,
        tipo_movel TEXT NOT NULL,
        medidas TEXT,
        fotos TEXT,
        observacoes TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table: users (for assembler login)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    // Create default user if not exists (admin/admin123)
    const insertUser = db.prepare("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)");
    insertUser.run("admin", "admin123");
    insertUser.finalize();
});

module.exports = db;
