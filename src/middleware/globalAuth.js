import jwt from 'jsonwebtoken';
import { getSecretKey } from '../utils/jwtKeyManager.js';

// List of public paths (regex or string)
const publicPaths = [
    /^\/api\/admin\/login\/?$/,
    /^\/api\/auth\/.*/, // All auth routes are public (login/register)
    /^\/$/ // Root might be public
];

function isPublic(path) {
    return publicPaths.some(pattern => {
        if (pattern instanceof RegExp) {
            return pattern.test(path);
        }
        return pattern === path;
    });
}

export default function globalAuth(req, res, next) {
    // Check if path is public
    if (isPublic(req.path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            message: 'Akses ditolak. Token tidak ditemukan (Unauthorized)',
            error_code: 'MISSING_TOKEN'
        });
    }

    try {
        const decoded = jwt.verify(token, getSecretKey());
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token sudah kadaluarsa, silakan login kembali',
                error_code: 'TOKEN_EXPIRED'
            });
        }
        return res.status(401).json({
            message: 'Token tidak valid',
            error_code: 'INVALID_TOKEN'
        });
    }
}
