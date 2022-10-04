import express from 'express'
import { httpCreateNewTask } from './task.controller'

const taskRouter = express.Router()

taskRouter.post('/', httpCreateNewTask)

export default taskRouter
