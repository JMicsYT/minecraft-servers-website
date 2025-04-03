// controllers/adminController.js
const pool = require('../server').pool;

const setUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'Пожалуйста, укажите роль пользователя.' });
    }

    try {
        const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, login, email, role';
        const result = await pool.query(query, [role, userId]);
        const updatedUser = result.rows[0];

        if (!updatedUser) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        res.status(200).json({ message: `Роль пользователя успешно обновлена.`, user: updatedUser });

    } catch (error) {
        console.error('Ошибка при назначении роли пользователю:', error);
        res.status(500).json({ message: 'Произошла ошибка при назначении роли пользователю.' });
    }
};

module.exports = {
    setUserRole,
};