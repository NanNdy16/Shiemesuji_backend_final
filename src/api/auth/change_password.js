import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { table, username, newPassword } = req.body;
  const hash = await bcrypt.hash(newPassword, 10);

  await db.query(
    `UPDATE ${table} SET password=? WHERE username=?`,
    [hash, username]
  );

  res.json({ message: 'Password berhasil diubah' });
});

export default router;
