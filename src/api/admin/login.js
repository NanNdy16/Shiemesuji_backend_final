import express from 'express';
import db from '../../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getSecretKey } from '../../utils/jwtKeyManager.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan Password harus diisi' });
  }

  const [rows] = await db.query(
    'SELECT * FROM admin WHERE username=?',
    [username]
  );

  if (!rows.length) {
    return res.status(401).json({ message: 'Admin tidak ditemukan' });
  }

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) {
    return res.status(401).json({ message: 'Password salah' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: rows[0].id, username: rows[0].username, role: 'admin' },
    getSecretKey(),
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login admin berhasil',
    token,
    admin: {
      id: rows[0].id,
      username: rows[0].username
    }
  });
});

export default router;

