import express from 'express';
import db from '../../db.js';
import bcrypt from 'bcrypt';
import authAdmin from '../../middleware/authAdmin.js';

const router = express.Router();

router.get('/', authAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_tma');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
