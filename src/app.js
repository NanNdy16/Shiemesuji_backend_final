import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import loginAdmin from './api/admin/login.js';
import loginCh from './api/auth/login_ch.js';
import loginTma from './api/auth/login_tma.js';
import loginKlim from './api/auth/login_klimatologi.js';
import { initializeKeyManager } from './utils/jwtKeyManager.js';
import globalAuth from './middleware/globalAuth.js';

const app = express();
app.use(express.json());

// Initialize JWT key manager
initializeKeyManager();

// Global Authentication Middleware
app.use(globalAuth);

// ADMIN
app.use('/api/admin/login', loginAdmin);

// AUTH USER
app.use('/api/auth/ch', loginCh);
app.use('/api/auth/tma', loginTma);
app.use('/api/auth/klimatologi', loginKlim);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;