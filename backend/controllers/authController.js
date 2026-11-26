const db = require('../config/db');

async function login(req, res) {
    const { crm, senha } = req.body;

    if (!crm || !senha) {
        return res.status(400).json({ message: 'Por favor, preencha o CRM e a senha.' });
    }

    try {
        // Consulta na tabela 'medico' do banco medkit_db
        const [rows] = await db.query(
            'SELECT id, nome, crm, especialidade, cargo_funcao FROM medico WHERE crm = ? AND senha = ?',
            [crm, senha]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'CRM ou senha inválidos. Acesso negado.' });
        }

        // Retorna os dados do médico autorizado (sem a senha)
        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: rows[0]
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno no servidor ao validar login.' });
    }
}

module.exports = { login };