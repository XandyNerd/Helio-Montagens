const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AgendamentoController = require('./controllers/AgendamentoController');
const AuthController = require('./controllers/AuthController');

// Configuração do Multer (Upload de Imagens)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware de Autenticação
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: 'Não autorizado' });
};

// Rotas de Agendamento (Público)
// 'fotos' deve corresponder ao name do input no frontend
router.post('/agendamento', upload.array('fotos', 5), AgendamentoController.create);

// Rotas de Agendamento (Privado - Montador)
router.get('/agendamentos', requireAuth, AgendamentoController.index);
router.get('/agendamento/:id', requireAuth, AgendamentoController.show);

// Rotas de Autenticação
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/auth/check', AuthController.checkAuth);

module.exports = router;
