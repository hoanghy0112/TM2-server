import express from 'express'

import authRouter from '../components/auth/auth.router'
import userRouter from '../components/user/user.router'

const api = express.Router()

api.use('/auth', authRouter)
api.use('/user', userRouter)

export default api
