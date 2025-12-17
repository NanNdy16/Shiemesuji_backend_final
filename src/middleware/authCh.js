import jwt from 'jsonwebtoken';
import { getSecretKey } from '../utils/jwtKeyManager.js';

export default function authCh(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, getSecretKey());
        if (decoded.role !== 'ch') {
            return res.status(403).json({ message: 'Akses CH ditolak' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid atau sudah expired' });
    }
}
