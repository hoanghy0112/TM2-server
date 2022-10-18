import express from 'express'

import authRouter from '../components/auth/auth.router'
import groupRouter from '../components/group/group.router'
import tagRouter from '../components/tag/tag.router'
import taskRouter from '../components/task/task.router'
import userRouter from '../components/user/user.router'

const api = express.Router()

// api.use('/auth', authRouter)
api.use('/user', userRouter)
api.use('/task', taskRouter)
api.use('/tag', tagRouter)
api.use('/group', groupRouter)

export default api
