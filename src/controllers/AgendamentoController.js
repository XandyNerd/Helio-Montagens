const db = require('../database');

const WHATSAPP_NUMBER = '5500000000000'; // Substitua pelo número real

exports.create = (req, res) => {
    const {
        nome, telefone, endereco, bairro, data, hora,
        servico, tipoMovel, medidas, observacoes, outroServicoDesc, descMovel
    } = req.body;

    // Validation
    if (!nome || !telefone || !endereco || !data || !hora || !servico || !tipoMovel) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    // Process Files
    const fotosPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const fotosStr = JSON.stringify(fotosPaths);

    // Prepare other fields
    const medidasStr = medidas || '';
    const obsStr = observacoes || '';

    // Insert into DB
    const query = `
        INSERT INTO agendamentos (
            nome_cliente, telefone, endereco, bairro, 
            data_agendamento, horario_agendamento, 
            tipo_servico, tipo_movel, medidas, 
            fotos, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        nome, telefone, endereco, bairro || '',
        data, hora,
        servico, tipoMovel, medidasStr,
        fotosStr, obsStr
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao salvar agendamento.' });
        }

        // Generate WhatsApp Message
        const dateObj = new Date(data + 'T00:00:00');
        const dateFormatted = dateObj.toLocaleDateString('pt-BR');

        let message = `*Solicitação de Orçamento (Via Site)*\n`;
        message += `-------------------------\n`;
        message += `👤 *Cliente:* ${nome}\n`;
        message += `📍 *Endereço:* ${endereco}\n`;
        if (bairro) message += `🏘 *Bairro:* ${bairro}\n`;
        message += `📅 *Data:* ${dateFormatted} às ${hora}\n`;
        message += `📞 *Contato:* ${telefone}\n\n`;

        message += `🛠 *Serviço:* ${servico}\n`;
        if (servico === 'Outro' && outroServicoDesc) {
            message += `   _Detalhe:_ ${outroServicoDesc}\n`;
        }

        message += `🪑 *Móvel:* ${tipoMovel}\n`;
        if (tipoMovel === 'Outros' && descMovel) {
            message += `   _Descrição:_ ${descMovel}\n`;
        }

        if (medidas) {
            message += `📏 *Medidas:* ${medidas}\n`;
        }

        if (fotosPaths.length > 0) {
            message += `📸 *Fotos:* O cliente enviou ${fotosPaths.length} foto(s) pelo site.\n`;
        }

        if (observacoes) {
            message += `\n💬 *Obs:* ${observacoes}`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        res.status(201).json({
            success: true,
            id: this.lastID,
            whatsappUrl: whatsappUrl
        });
    });
};

exports.index = (req, res) => {
    const query = `SELECT * FROM agendamentos ORDER BY criado_em DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
        }
        // Parse fotos JSON
        const agendamentos = rows.map(row => ({
            ...row,
            fotos: JSON.parse(row.fotos || '[]')
        }));
        res.json(agendamentos);
    });
};

exports.show = (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM agendamentos WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar agendamento.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Agendamento não encontrado.' });
        }
        row.fotos = JSON.parse(row.fotos || '[]');
        res.json(row);
    });
};
