import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const secretFilePath = path.join(__dirname, 'jwt-secret.json');

// Cache for the current key
let keyCache = null;

/**
 * Generate a random 64-character hex string as secret key
 */
function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Save secret key and expiration to file
 */
function saveKeyToFile(secret, expiresAt) {
    const data = JSON.stringify({ secret, expiresAt }, null, 2);
    try {
        fs.writeFileSync(secretFilePath, data, 'utf8');
    } catch (err) {
        console.error('[JWT] Failed to save secret key to file:', err);
    }
}

/**
 * Load secret key from file
 * Returns null if file doesn't exist or error reading
 */
function loadKeyFromFile() {
    try {
        if (fs.existsSync(secretFilePath)) {
            const data = fs.readFileSync(secretFilePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('[JWT] Failed to load secret key from file:', err);
    }
    return null;
}

/**
 * Get the current secret key
 * Handles automatic rotation every 7 days
 */
export function getSecretKey() {
    const now = Date.now();

    // Use cached key if valid
    if (keyCache && keyCache.expiresAt > now) {
        return keyCache.secret;
    }

    // Try loading from file
    const loaded = loadKeyFromFile();
    if (loaded && loaded.expiresAt > now) {
        keyCache = loaded;
        return loaded.secret;
    }

    // Generate new key if no valid key exists
    return rotateKey();
}

/**
 * Rotate the secret key (generate new one)
 * Sets expiration to 7 days from now
 */
export function rotateKey() {
    const secret = generateSecretKey();
    const days = parseInt(process.env.JWT_ROTATION_DAYS || '7');
    const expiresAt = Date.now() + (days * 24 * 60 * 60 * 1000);

    keyCache = { secret, expiresAt };
    saveKeyToFile(secret, expiresAt);

    console.log(`[JWT] New secret key generated. Expires at: ${new Date(expiresAt).toISOString()} (${days} days)`);
    return secret;
}

/**
 * Initialize the key manager
 */
export function initializeKeyManager() {
    getSecretKey(); // Ensure key exists
    console.log('[JWT] Key manager initialized with 7-day persistent rotation');
}

export default {
    getSecretKey,
    rotateKey,
    initializeKeyManager
};
