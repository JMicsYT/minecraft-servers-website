const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Настройка подключения к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Проверка подключения к базе данных
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL:', err));

// Импортируем маршруты
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/servers'); // <--- ИЗМЕНЕНО
const newsRoutes = require('./routes/news');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Используем маршруты
app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/news', newsRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Тестовый эндпоинт
app.get('/api', (req, res) => {
    res.json({ message: 'Backend API is running!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});