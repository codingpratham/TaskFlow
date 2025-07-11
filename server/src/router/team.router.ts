const express = require('express');
import { requireAuth } from '../middleware/protectedRouter';
import { createProject, createTeam, getAllProjects, getTeam, getTeamMembers, inviteToTeam } from '../controller/team.controller';


const router = express.Router();

router.post('/create', requireAuth, createTeam )
router.get('/get', requireAuth, getTeam)
router.post('/invite', requireAuth, inviteToTeam);
router.get('/getTeam/:teamId', requireAuth, getTeamMembers)
router.post('/projects',requireAuth,createProject)
router.get('/projects',requireAuth,getAllProjects)


export default router;
