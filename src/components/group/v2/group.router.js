import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'

import { getAllGrTasksOfUser } from '../../groupTask/groupTask.model'
import { httpCreateNewGroup, socketGetGroupByID } from './group.controller'

const groupRouter = express.Router()

groupRouter.post('/', authorizeRouteMiddleware, httpCreateNewGroup)

export async function setupGroupSocketListener(socket, user) {
	const groupIDs = (await getAllGrTasksOfUser(user._id)).map(
		(group) => group._id,
	)
	groupIDs.forEach((groupID) => {
		socket.join(`group:${groupID}`)
	})

	socket.on('create-group', (groupID) => {
		socket.join(`group:${groupID}`)
	})

	socket.on('group-info', (groupID) => socketGetGroupByID(groupID))
}

export default groupRouter
