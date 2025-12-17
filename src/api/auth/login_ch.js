import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../db.js';
import { getSecretKey } from '../../utils/jwtKeyManager.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth CH aktif' });
});

router.post('/', async (req, res) => {
  console.log('Login CH request received:', req.body);
  try {
    const { username, password } = req.body;
    console.log('Finding user:', username);

    const [rows] = await db.query(
      'SELECT * FROM user_ch WHERE username = ?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'User CH tidak ditemukan' });
    }

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username, id_pos: rows[0].id_pos, role: 'ch' },
      getSecretKey(),
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login CH berhasil',
      token,
      user: {
        id: rows[0].id,
        username: rows[0].username,
        id_pos: rows[0].id_pos,
        nama_pos: rows[0].nama_pos
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;

