import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'

import {
	httpGetUserInvitations,
	httpGetUserRequests,
	httpUpdateUserInfo,
	socketGetAllGroup,
	socketGetUserInfo,
} from './user.controller'

const userRouter = express.Router()

userRouter.get('/requests', authorizeRouteMiddleware, httpGetUserRequests)
userRouter.get('/invitations', authorizeRouteMiddleware, httpGetUserInvitations)

userRouter.put('/', authorizeRouteMiddleware, httpUpdateUserInfo)

export function setupUserSocketListener(socket, user) {
	socket.on('user-info', () => socketGetUserInfo(socket, user))
	socket.on('groups', () => socketGetAllGroup(socket, user))
}

export default userRouter
