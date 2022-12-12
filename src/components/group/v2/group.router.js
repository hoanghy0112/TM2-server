import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'

import { getAllGrTasksOfUser } from '../../groupTask/groupTask.model'
import {
	httpAddUserToGroup,
	httpCreateNewGroup,
	httpDeleteGroupByID,
	httpGetAllBusyTimeOfGroup,
	httpRemoveUserFromGroup,
	socketGetGroupByID,
} from './group.controller'

const groupRouter = express.Router()

groupRouter.post('/', authorizeRouteMiddleware, httpCreateNewGroup)
groupRouter.put('/:groupID/add', authorizeRouteMiddleware, httpAddUserToGroup)
groupRouter.get(
	'/:groupID/busy',
	authorizeRouteMiddleware,
	httpGetAllBusyTimeOfGroup,
)
groupRouter.put(
	'/:groupID/:memberID/remove',
	authorizeRouteMiddleware,
	httpRemoveUserFromGroup,
)
groupRouter.delete('/:groupID', authorizeRouteMiddleware, httpDeleteGroupByID)

export async function setupGroupSocketListener(socket, user) {
	const groupIDs = (await getAllGrTasksOfUser(user._id)).map(
		(group) => group._id,
	)

	socket.on('group-info', (groupID) => socketGetGroupByID(socket, groupID))
}

export default groupRouter
