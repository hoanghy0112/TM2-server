import express from 'express'

import authRouter from '../components/auth/auth.router'
import groupRouter from '../components/group/group.router'
import tagRouter from '../components/tag/tag.router'
import taskRouter from '../components/task/task.router'
import userRouter from '../components/user/user.router'
import { authorizeRouteMiddleware } from '../middleware/authentication'

const api = express.Router()

// api.use('/auth', authRouter)
api.use('/user', authorizeRouteMiddleware, userRouter)
api.use('/task', authorizeRouteMiddleware, taskRouter)
api.use('/tag', authorizeRouteMiddleware, tagRouter)
api.use('/group', authorizeRouteMiddleware, groupRouter)

export default api
