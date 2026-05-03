import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';

const JWT_SECRET = process.env.JWT_SECRET || 'tajni_kljuc';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    const [rows]: any = await db.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    const userId = rows[0].id;

    await db.execute(
      'INSERT INTO heroes (user_id) VALUES (?)',
      [userId]
    );

    res.json({ ok: true });
  } 
  catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already taken' });
    } 
    else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const [rows]: any = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } 
  catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};