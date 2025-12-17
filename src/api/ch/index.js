import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: true, message: 'API CH' });
});

export default router;
