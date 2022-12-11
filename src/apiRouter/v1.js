import express from 'express'

import groupRouter from '../components/group/group.router'
import tagRouter from '../components/tag/tag.router'
import taskRouter from '../components/task/task.router'
import userRouter from '../components/user/user.router'
import groupTaskRouter from '../components/groupTask/groupTask.router'
import notificationsRouter from '../components/notification/v1/notification.router'

const v1API = express.Router()

v1API.use('/user', userRouter)
v1API.use('/task', taskRouter)
v1API.use('/tag', tagRouter)
v1API.use('/group', groupRouter)
v1API.use('/groupTasks', groupTaskRouter)
v1API.use('/notifications', notificationsRouter)

export default v1API
