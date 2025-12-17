import express from 'express';
import db from '../../db.js';
import bcrypt from 'bcrypt';
import authAdmin from '../../middleware/authAdmin.js';

const router = express.Router();

router.post('/', authAdmin, async (req, res) => {
  const { username, id_pos, nama_pos } = req.body;
  const password = await bcrypt.hash('bbws_perairan', 10);

  await db.query(
    'INSERT INTO user_klimatologi (username, password, id_pos, nama_pos) VALUES (?,?,?,?)',
    [username, password, id_pos, nama_pos]
  );

  res.json({ message: 'User Klimatologi berhasil dibuat' });
});

export default router;
