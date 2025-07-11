import { createTask, getAllFormattedTasks, updateTask } from "../controller/task.controller";
import { requireAuth } from "../middleware/protectedRouter";

const { Router } = require('express');

const router = Router();

router.post('/create', requireAuth, createTask);
router.put('/status/:taskId', requireAuth, updateTask);
router.get('/get',requireAuth,getAllFormattedTasks)

export default router;
