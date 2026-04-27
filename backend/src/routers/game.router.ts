import { Router } from "express";
import { getRunConfig, getMonsterMove, playerAttack, getHero } from "../controllers/game.controller";

const router = Router();

router.get("/run/config", getRunConfig);
router.post("/battle/next-move", getMonsterMove);
router.post("/battle/attack", playerAttack);
router.get("/hero", getHero);

export default router;