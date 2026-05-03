import type { Request, Response } from "express";
import { db } from "../database/db";

export const saveRun = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const state = req.body.state;

  if (!userId) {
    res.json({ ok: true });
    return;
  }

  const stateJson = JSON.stringify(state);

  await db.execute(
    `INSERT INTO saved_runs (user_id, state) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE state = ?, saved_at = CURRENT_TIMESTAMP`,
    [userId, stateJson, stateJson]
  );

  res.json({ ok: true });
};

export const loadRun = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if (!userId) {
    res.json({ save: null });
    return;
  }

  const [rows]: any = await db.execute(
    'SELECT state, saved_at FROM saved_runs WHERE user_id = ?',
    [userId]
  );

  if (rows.length === 0) {
    res.json({ save: null });
    return;
  }

  const state = typeof rows[0].state === 'string' ? JSON.parse(rows[0].state) : rows[0].state;

  res.json({
    save: {
      state,
      savedAt: rows[0].saved_at
    }
  });
};

export const deleteRun = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if (!userId) {
    res.json({ ok: true });
    return;
  }

  await db.execute('DELETE FROM saved_runs WHERE user_id = ?', [userId]);
  res.json({ ok: true });
};