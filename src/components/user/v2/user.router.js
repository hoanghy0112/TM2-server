import express from 'express'
import { authorizeRouteMiddleware } from '../../../middleware/authentication'

import {
	httpUpdateUserInfo,
	socketGetAllGroup,
	socketGetUserInfo,
} from './user.controller'

const userRouter = express.Router()

userRouter.put('/', authorizeRouteMiddleware, httpUpdateUserInfo)

export function setupUserSocketListener(socket, user) {
	socket.on('user-info', () => socketGetUserInfo(socket, user))
	socket.on('groups', () => socketGetAllGroup(socket, user))
}

export default userRouter
