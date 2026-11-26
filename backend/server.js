const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventoryRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- 1. Importa a rota de login

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'API do MedKit rodando!' });
});

app.use('/api/estoque', inventoryRoutes);
app.use('/api', authRoutes); // <-- 2. Ativa a rota POST /api/login

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});