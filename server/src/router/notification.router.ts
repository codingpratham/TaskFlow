import { getNotifications, markAsRead } from "../controller/notification.controller";
import { requireAuth } from "../middleware/protectedRouter";

const express = require('express');
const router = express.Router();

router.get('/',requireAuth,getNotifications)
router.put('/:id/read',requireAuth,markAsRead)

export default router;