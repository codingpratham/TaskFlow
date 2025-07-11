const express = require('express')
import authRouter from '../router/auth.router'
import teamRouter from './team.router'
import taskRouter from './task.router'
import userRouter from './user.router'
import notificationRouter from './notification.router'


const router = express.Router()

router.use('/auth', authRouter)
router.use('/team',teamRouter)
router.use('/task', taskRouter)
router.use('/user', userRouter)
router.use('/notification', notificationRouter) 
 

export default router