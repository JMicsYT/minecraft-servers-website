const server = require('../server');
const pool = server.pool;

const getServers = async (req, res) => {
  try {
    const query = 'SELECT id, name, online, player_count, max_players, version FROM servers';
    const result = await pool.query(query);
    res.status(200).json({ servers: result.rows });
  } catch (error) {
    console.error('Ошибка при получении списка серверов из базы данных:', error);
    res.status(500).json({ message: 'Произошла ошибка при получении списка серверов.' });
  }
};

const getServerById = async (req, res) => {
  const serverId = req.params.serverId;

  try {
    const query = 'SELECT * FROM servers WHERE id = $1';
    const result = await pool.query(query, [serverId]);
    const server = result.rows[0];

    if (server) {
      res.status(200).json({ server });
    } else {
      res.status(404).json({ message: 'Сервер не найден.' });
    }
  } catch (error) {
    console.error(`Ошибка при получении информации о сервере с ID ${serverId}:`, error);
    res.status(500).json({ message: 'Произошла ошибка при получении информации о сервере.' });
  }
};

const addServer = async (req, res) => {
    const { name, ip_address, port, description, online, max_players, version } = req.body;
  
    if (!name || !ip_address) {
      return res.status(400).json({ message: 'Пожалуйста, укажите название и IP-адрес сервера.' });
    }
  
    try {
      const query = `
        INSERT INTO servers (name, ip_address, port, description, online, max_players, version)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, ip_address, port, description, online, player_count, max_players, version, created_at, updated_at
      `;
      const values = [name, ip_address, port || 25565, description || null, online || false, max_players || 20, version || null];
      const result = await pool.query(query, values);
      const newServer = result.rows[0];
  
      res.status(201).json({ message: 'Сервер успешно добавлен.', server: newServer });
    } catch (error) {
      console.error('Ошибка при добавлении сервера в базу данных:', error);
      if (error.code === '23505' && error.constraint === 'servers_ip_address_key') {
        return res.status(409).json({ message: 'Сервер с таким IP-адресом уже существует.' });
      }
      res.status(500).json({ message: 'Произошла ошибка при добавлении сервера.' });
    }
  };
  
  const editServer = async (req, res) => {
    const serverId = req.params.serverId;
    const { name, ip_address, port, description, online, max_players, version } = req.body;
  
    if (!name || !ip_address) {
      return res.status(400).json({ message: 'Пожалуйста, укажите название и IP-адрес сервера.' });
    }
  
    try {
      const query = `
        UPDATE servers
        SET name = $1,
            ip_address = $2,
            port = $3,
            description = $4,
            online = $5,
            max_players = $6,
            version = $7,
            updated_at = NOW()
        WHERE id = $8
        RETURNING id, name, ip_address, port, description, online, player_count, max_players, version, created_at, updated_at
      `;
      const values = [name, ip_address, port || 25565, description || null, online || false, max_players || 20, version || null, serverId];
      const result = await pool.query(query, values);
      const updatedServer = result.rows[0];
  
      if (updatedServer) {
        res.status(200).json({ message: 'Информация о сервере успешно обновлена.', server: updatedServer });
      } else {
        res.status(404).json({ message: 'Сервер с указанным ID не найден.' });
      }
    } catch (error) {
      console.error(`Ошибка при обновлении сервера с ID ${serverId}:`, error);
      if (error.code === '23505' && error.constraint === 'servers_ip_address_key') {
        return res.status(409).json({ message: 'Сервер с таким IP-адресом уже существует.' });
      }
      res.status(500).json({ message: 'Произошла ошибка при обновлении сервера.' });
    }
  };
  
  const deleteServer = async (req, res) => {
    const serverId = req.params.serverId;
  
    try {
      const query = 'DELETE FROM servers WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [serverId]);
      const deletedServer = result.rows[0];
  
      if (deletedServer) {
        res.status(200).json({ message: `Сервер с ID ${serverId} успешно удален.`, deletedId: deletedServer.id });
      } else {
        res.status(404).json({ message: `Сервер с ID ${serverId} не найден.` });
      }
    } catch (error) {
      console.error(`Ошибка при удалении сервера с ID ${serverId}:`, error);
      res.status(500).json({ message: 'Произошла ошибка при удалении сервера.' });
    }
  };
  
  module.exports = { getServers, getServerById, addServer, editServer, deleteServer }; // Экспортируем deleteServer