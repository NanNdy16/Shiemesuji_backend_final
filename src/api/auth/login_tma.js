import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../db.js';
import { getSecretKey } from '../../utils/jwtKeyManager.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth TMA aktif' });
});

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM user_tma WHERE username = ?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'User TMA tidak ditemukan' });
    }

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username, id_pos: rows[0].id_pos, role: 'tma' },
      getSecretKey(),
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login TMA berhasil',
      token,
      user: {
        id: rows[0].id,
        username: rows[0].username,
        id_pos: rows[0].id_pos,
        nama_pos: rows[0].nama_pos
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

