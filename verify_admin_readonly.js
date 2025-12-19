import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function run() {
    // 1. Login
    const loginRes = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testadmin', password: 'testpassword' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        process.exit(1);
    }

    const { token } = await loginRes.json();
    console.log('Login successful');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // 2. Test GET (Should Succeed)
    console.log('Testing GET /api/admin/users/ch...');
    const getRes = await fetch(`${BASE_URL}/admin/users/ch`, { headers });
    if (getRes.ok) {
        console.log('PASS: GET /api/admin/users/ch returned 200 OK');
        const data = await getRes.json();
        console.log('Data length:', data.length);
    } else {
        console.error('FAIL: GET /api/admin/users/ch failed:', getRes.status);
    }

    // 3. Test POST (Should Fail - 404 Not Found since we removed the route, or 405 if method disallowed depending on express default, likely 404)
    console.log('Testing POST /api/admin/users/ch...');
    const postRes = await fetch(`${BASE_URL}/admin/users/ch`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username: 'baduser', id_pos: '1', nama_pos: 'Bad' })
    });

    if (postRes.status === 404) {
        console.log('PASS: POST /api/admin/users/ch returned 404 Not Found (Route removed)');
    } else {
        console.error(`FAIL: POST /api/admin/users/ch returned ${postRes.status} (Expected 404)`);
    }

    // Test other endpoints briefly
    const endpoints = ['tma', 'klimatologi'];
    for (const ep of endpoints) {
        const res = await fetch(`${BASE_URL}/admin/users/${ep}`, { headers });
        if (res.ok) console.log(`PASS: GET /api/admin/users/${ep} returned 200 OK`);
        else console.error(`FAIL: GET /api/admin/users/${ep} failed`);
    }

}

run().catch(console.error);
