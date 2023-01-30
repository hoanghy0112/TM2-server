import express from 'express'
import {
	httpCreateNewTask,
	httpDeleteTaskByID,
	httpGetAllGrTaskOfGroup,
	httpGetTaskByID,
	httpUpdateTaskByID,
	httpJoinTask,
	httpQuitTask,
} from './groupTask.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const groupTaskRouter = express.Router()

groupTaskRouter.post('/', authorizeRouteMiddleware, httpCreateNewTask)
groupTaskRouter.get(
	'/:groupID',
	authorizeRouteMiddleware,
	httpGetAllGrTaskOfGroup,
)
// update chung chung như là tile, time ...
groupTaskRouter.put('/:taskID', authorizeRouteMiddleware, httpUpdateTaskByID)
groupTaskRouter.get('/:taskID', authorizeRouteMiddleware, httpGetTaskByID)
groupTaskRouter.delete('/:taskID', authorizeRouteMiddleware, httpDeleteTaskByID)
// tách phần này ra khỏi phần update task vì member tự tham gia hoặc ko tham gia task ng khác ko có quyền chỉnh sửa
groupTaskRouter.put('/join/:taskID', authorizeRouteMiddleware, httpJoinTask)
groupTaskRouter.put('/quit/:taskID', authorizeRouteMiddleware, httpQuitTask)

export default groupTaskRouter
