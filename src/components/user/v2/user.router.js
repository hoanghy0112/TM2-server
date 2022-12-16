import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'

import {
	httpAcceptJoinGroup,
	httpGetUserInvitations,
	httpGetUserRequests,
	httpRequestJoinGroup,
	httpUpdateUserInfo,
	socketGetAllGroup,
	socketGetUserInfo,
} from './user.controller'

const userRouter = express.Router()

userRouter.put(
	'/request-join/:groupID',
	authorizeRouteMiddleware,
	httpRequestJoinGroup,
)
userRouter.put(
	'/accept-join/:groupID',
	authorizeRouteMiddleware,
	httpAcceptJoinGroup,
)
userRouter.get('/requests', authorizeRouteMiddleware, httpGetUserRequests)
userRouter.get('/invitations', authorizeRouteMiddleware, httpGetUserInvitations)

userRouter.put('/', authorizeRouteMiddleware, httpUpdateUserInfo)

export function setupUserSocketListener(socket, user) {
	socket.on('user-info', () => socketGetUserInfo(socket, user))
	socket.on('groups', () => socketGetAllGroup(socket, user))
}

export default userRouter
