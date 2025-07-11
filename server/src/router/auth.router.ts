const express = require('express')
import { Request, Response } from 'express'
import { register, login, logout } from '../controller/auth.controller'


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout',logout)
router.get('/me', (req:Request, res:Response) => {
  if (req.user) {
    res.status(200).json({ user: req.user })
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

export default router