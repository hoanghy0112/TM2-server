import express from 'express'
import {
	httpGetNotificationsOfUser,
    httpSetReadNotification,
} from './notification.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const notificatiosnRouter = express.Router()

notificatiosnRouter.get('/', authorizeRouteMiddleware, httpGetNotificationsOfUser)
notificatiosnRouter.put('/', authorizeRouteMiddleware, httpSetReadNotification)

export default notificatiosnRouter