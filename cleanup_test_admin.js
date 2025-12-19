import db from './src/db.js';

async function cleanup() {
    try {
        await db.query('DELETE FROM admin WHERE username = ?', ['testadmin']);
        console.log('Deleted testadmin');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanup();
