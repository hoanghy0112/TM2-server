import express from 'express'
import {
	httpCreateNewTask,
	httpDeleteTaskByID,
	httpGetAllTaskOfUser,
	httpGetTaskByID,
	httpUpdateTaskByID,
	httpChangeDay,
} from './task.controller'

import { authorizeRouteMiddleware } from '../../../middleware/authentication'

const taskRouter = express.Router()

taskRouter.post('/', authorizeRouteMiddleware, httpCreateNewTask)
taskRouter.get('/', authorizeRouteMiddleware, httpGetAllTaskOfUser)
taskRouter.put('/:taskID', authorizeRouteMiddleware, httpUpdateTaskByID)
taskRouter.get('/:taskID', authorizeRouteMiddleware, httpGetTaskByID)
taskRouter.delete('/:taskID', authorizeRouteMiddleware, httpDeleteTaskByID)

taskRouter.put('/day/:taskID', authorizeRouteMiddleware, httpChangeDay)

export default taskRouter
