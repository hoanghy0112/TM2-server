import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'
import {
	httpCreateNewTask,
	httpDeleteTaskByID,
	httpUpdateTaskByID,
	socketGetAllTaskOfUser,
	socketGetTaskByID,
} from './task.controller'

const taskRouter = express.Router()

taskRouter.post('/', authorizeRouteMiddleware, httpCreateNewTask)
taskRouter.put('/:taskID', authorizeRouteMiddleware, httpUpdateTaskByID)
taskRouter.delete('/:taskID', authorizeRouteMiddleware, httpDeleteTaskByID)

export async function setupTaskSocketListener(socket, user) {
	const userID = user._id

	socket.on('get-tasks', (from, to) =>
		socketGetAllTaskOfUser(socket, userID, from, to),
	)

	socket.on('get-task', (taskID) => socketGetTaskByID(socket, taskID))
}

export default taskRouter
