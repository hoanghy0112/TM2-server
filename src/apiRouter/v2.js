import express from 'express'
import groupRouter, {
	setupGroupSocketListener,
} from '../components/group/v2/group.router'
import setupNotificationSocketListener from '../components/notification/v2/notification.router'
import userRouter, {
	setupUserSocketListener,
} from '../components/user/v2/user.router'

import taskRouter from '../components/task/v2/task.router'
import { authorizeSocketMiddleware } from '../middleware/socketAuthentication'
import { setupTaskSocketListener } from '../components/task/v2/task.router'

const v2API = express.Router()
v2API.use('/group', groupRouter)
v2API.use('/user', userRouter)
v2API.use('/task', taskRouter)

export default v2API

export function socketHandlerV2(io) {
	io.use(authorizeSocketMiddleware)

	io.on('connection', (socket) => {
		console.log('New connection')

		const { user } = socket

		setupUserSocketListener(socket, user)
		setupNotificationSocketListener(socket, user)
		setupGroupSocketListener(socket, user)
		setupTaskSocketListener(socket, user)
	})
}
