import express from "express";
import bcrypt from "bcrypt";
import db from "../../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).json({ error: "Missing fields" });

    const table = role === "ch" ? "user_ch" : role === "tma" ? "user_tma" : "user_klimatologi";

    const [rows] = await db.query(`SELECT * FROM ${table} WHERE username = ?`, [username]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    res.json({ message: "Login success", user: { id: user.id, username: user.username, nama_pos: user.nama_pos } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
