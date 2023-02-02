import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'

import { getAllGrTasksOfGroup } from '../../groupTask/groupTask.model'
import {
	httpAcceptUserToJoinGroup,
	httpAddUserToGroup,
	httpCreateNewGroup,
	httpDeleteGroupByID,
	httpGetAllBusyTimeOfGroup,
	httpInviteJoinGroup,
	httpRemoveUserFromGroup,
	httpUpdateGroup,
	socketGetAllBusyTimeOfGroup,
	socketGetGroupByID,
	socketGetGroupTasks,
} from './group.controller'

const groupRouter = express.Router()

groupRouter.post('/', authorizeRouteMiddleware, httpCreateNewGroup)
groupRouter.put('/:groupID', authorizeRouteMiddleware, httpUpdateGroup)
groupRouter.put('/:groupID/add', authorizeRouteMiddleware, httpAddUserToGroup)
groupRouter.put(
	'/:groupID/invite',
	authorizeRouteMiddleware,
	httpInviteJoinGroup,
)
groupRouter.put(
	'/:groupID/accept',
	authorizeRouteMiddleware,
	httpAcceptUserToJoinGroup,
)

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
	socket.on('group-info', (groupID) => socketGetGroupByID(socket, groupID))
	socket.on('get-busy', (groupID, from, to) =>
		socketGetAllBusyTimeOfGroup(socket, groupID, from, to),
	)
	socket.on('get-group-tasks', (groupID, from, to) =>
		socketGetGroupTasks(socket, groupID, from, to),
	)
}

export default groupRouter
