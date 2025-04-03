// models/news.js
const pool = require('../server').pool;

const News = {
    create: async (title, content, category, userId) => {
        const query = 'INSERT INTO news (title, content, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [title, content, category, userId];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    getAll: async () => {
        const query = 'SELECT * FROM news';
        const { rows } = await pool.query(query);
        return rows;
    },

    getById: async (id) => {
        const query = 'SELECT * FROM news WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    update: async (id, title, content, category, userId) => {
        const query = 'UPDATE news SET title = $1, content = $2, category = $3, user_id = $4 WHERE id = $5 RETURNING *';
        const values = [title, content, category, userId, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    delete: async (id) => {
        const query = 'DELETE FROM news WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    getByCategory: async (category) => {
        const query = 'SELECT * FROM news WHERE category = $1';
        const { rows } = await pool.query(query, [category]);
        return rows;
    },
};

module.exports = News;