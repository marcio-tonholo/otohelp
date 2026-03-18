require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Rotas
const authRoutes = require('./src/routes/auth');
const mentorRoutes = require('./src/routes/mentors');
const studentRoutes = require('./src/routes/students');
const experienceRoutes = require('./src/routes/experiences');
const bookingRoutes = require('./src/routes/bookings');
const notificationRoutes = require('./src/routes/notifications');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
});

module.exports = app;
