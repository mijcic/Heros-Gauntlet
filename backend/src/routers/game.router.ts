import { Router } from "express";
import { getRunConfig, getMonsterMove, playerAttack, getHero, setCurrentMonster, saveLearnedMove, chooseStat, resetHero, continueFighting, getHeroClasses, selectHeroClass } from "../controllers/game.controller";
import { register, login } from "../controllers/auth.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { saveRun, loadRun, deleteRun } from "../controllers/save.controller"
import { getEnvironments, setEnvironment } from "../controllers/game.controller";

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get("/run/config", getRunConfig);
router.get('/environments', getEnvironments);
router.get('/hero-classes', getHeroClasses);

router.get("/hero", authMiddleware, getHero);
router.post('/hero/learned-move', authMiddleware, saveLearnedMove);
router.post('/hero/choose-stat', authMiddleware, chooseStat);
router.post('/hero/reset', authMiddleware, resetHero);
router.post('/hero/continue-fighting', authMiddleware, continueFighting);
router.post('/hero/select-class', authMiddleware, selectHeroClass);

router.post("/battle/next-move", authMiddleware, getMonsterMove);
router.post("/battle/attack", authMiddleware, playerAttack);
router.post("/battle/set-monster", authMiddleware, setCurrentMonster);
router.post('/battle/set-environment', authMiddleware, setEnvironment);

router.post('/run/save', authMiddleware, saveRun);
router.get('/run/load', authMiddleware, loadRun);
router.delete('/run/save', authMiddleware, deleteRun);

export default router;