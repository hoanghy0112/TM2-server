import express from 'express'
import {
	httpCreateNewTask,
	httpGetAllTaskOfUser,
	httpGetTaskByID,
	httpUpdateTaskByID,
} from './task.controller'

const taskRouter = express.Router()

taskRouter.post('/', httpCreateNewTask)
taskRouter.get('/', httpGetAllTaskOfUser)
taskRouter.put('/:taskID', httpUpdateTaskByID)
taskRouter.get('/:taskID', httpGetTaskByID)

export default taskRouter
