import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'
import {
	httpCreateNewTask,
	httpDeleteTaskByID,
	httpResponseTaskByID,
	httpResponseUserRequestOfTask,
	httpUpdateTaskByID,
	socketGetAllTaskOfUser,
	socketGetTaskByID,
} from './task.controller'

const taskRouter = express.Router()

taskRouter.post('/', authorizeRouteMiddleware, httpCreateNewTask)
taskRouter.put('/:taskID', authorizeRouteMiddleware, httpUpdateTaskByID)
taskRouter.delete('/:taskID', authorizeRouteMiddleware, httpDeleteTaskByID)
taskRouter.put(
	'/response/:taskID',
	authorizeRouteMiddleware,
	httpResponseTaskByID,
)
taskRouter.put(
	'/response/:taskID/reply/:participantID',
	authorizeRouteMiddleware,
	httpResponseUserRequestOfTask,
)

export async function setupTaskSocketListener(socket, user) {
	const userID = user._id

	socket.on('get-tasks', (from, to) =>
		socketGetAllTaskOfUser(socket, userID, from, to),
	)

	socket.on('get-task', (taskID) => socketGetTaskByID(socket, taskID, userID))
}

export default taskRouter
