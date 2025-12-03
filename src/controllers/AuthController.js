const db = require('../database');

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no servidor.' });
        }
        if (!row) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Save session
        req.session.user = { id: row.id, username: row.username };
        res.json({ success: true, message: 'Login realizado com sucesso.' });
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ success: true });
};

exports.checkAuth = (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
};
