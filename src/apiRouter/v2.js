import express from 'express'
import {
	socketGetNotificationsOfUser,
	socketSetReadNotification,
} from '../components/notification/v2/notification.controller'
import setupNotificationSocketListener from '../components/notification/v2/notification.router'

import { authorizeSocketMiddleware } from '../middleware/socketAuthentication'

const v2API = express.Router()

// v2API.use('/notifications', notificationsRouter)

export default v2API

export function socketHandlerV2(io) {
	io.use(authorizeSocketMiddleware)

	io.on('connection', (socket) => {
		console.log('New connection')

		const { user } = socket

		setupNotificationSocketListener(socket, user)
	})
}
