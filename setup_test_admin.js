import db from './src/db.js';
import bcrypt from 'bcrypt';

async function setup() {
    try {
        const password = await bcrypt.hash('testpassword', 10);
        // Check if exists first
        const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', ['testadmin']);
        if (rows.length > 0) {
            await db.query('UPDATE admin SET password = ? WHERE username = ?', [password, 'testadmin']);
            console.log('Updated existing testadmin');
        } else {
            await db.query('INSERT INTO admin (username, password, nama) VALUES (?, ?, ?)', ['testadmin', password, 'Test Admin']);
            console.log('Created testadmin');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

setup();
