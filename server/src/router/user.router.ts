
import { getTasks, getUser, noTeam } from "../controller/user.controller";
import { requireAuth } from "../middleware/protectedRouter";

const express = require('express');

const router = express.Router();

router .get('/noTeam', requireAuth, noTeam);
router.get('/getTasks', requireAuth, getTasks); 
router.get('/get', getUser)

export default router;