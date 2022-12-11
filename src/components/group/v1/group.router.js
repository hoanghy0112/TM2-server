import express from 'express'
import {
	htppGetAllGroup,
	httpAddUserToGroup,
	httpRemoveUserFromGroup,
	httpCreateNewGroup,
	httpGetGroupByID,
	httpDeleteGroupByID,
	httpGetAllTaskOfGroup,
} from './group.controller'

import { authorizeRouteMiddleware } from '../../../middleware/authentication'

const groupRouter = express.Router()

groupRouter.post('/', authorizeRouteMiddleware, httpCreateNewGroup)
groupRouter.get('/', authorizeRouteMiddleware, htppGetAllGroup)
groupRouter.get('/:id', authorizeRouteMiddleware, httpGetGroupByID)
groupRouter.get(
	'/:groupID/tasks',
	authorizeRouteMiddleware,
	httpGetAllTaskOfGroup,
)
// api rieng cho admin them xoa thanh vien trong group
groupRouter.put('/:groupID/add', authorizeRouteMiddleware, httpAddUserToGroup)
groupRouter.put(
	'/:groupID/:memberID/remove',
	authorizeRouteMiddleware,
	httpRemoveUserFromGroup,
)
groupRouter.delete('/:groupID', authorizeRouteMiddleware, httpDeleteGroupByID)
export default groupRouter
