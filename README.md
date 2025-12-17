Shiemesuji Backend (Bun + Express) - Final package

Instructions:
1. Put this folder where you want to run the backend.
2. Open terminal in this folder:
   bun add express cors mysql2 bcrypt
3. Ensure MySQL database 'shiemesuji' and required tables exist.
4. Edit db.js if your MySQL password/user/database differ.
5. Start server:
   bun run app.js
6. Test endpoints using Postman / Hoppscotch:
   GET  http://localhost:3000/api/ch
   POST http://localhost:3000/api/ch  (json body)
