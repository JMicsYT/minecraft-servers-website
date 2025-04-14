const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const serverRoutes = require('./routes/servers')
const newsRoutes = require('./routes/news'); // Импортируйте newsRoutes
const adminRoutes = require('./routes/admin');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение маршрутов
app.use('/api/servers', serverRoutes);
app.use('/api/news', newsRoutes); // Подключите newsRoutes по желаемому пути, например '/api/news'
app.use('/api/admin', adminRoutes);

// ... остальной код вашего сервера (например, порт прослушивания)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});