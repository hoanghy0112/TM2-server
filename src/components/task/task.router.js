import express from 'express'
import {
	httpCreateNewTask,
	httpDeleteTaskByID,
	httpGetAllTaskOfUser,
	httpGetTaskByID,
	httpUpdateTaskByID,
} from './task.controller'

const taskRouter = express.Router()

taskRouter.post('/', httpCreateNewTask)
taskRouter.get('/', httpGetAllTaskOfUser)
taskRouter.put('/:taskID', httpUpdateTaskByID)
taskRouter.get('/:taskID', httpGetTaskByID)
taskRouter.delete('/:taskID', httpDeleteTaskByID)

export default taskRouter
