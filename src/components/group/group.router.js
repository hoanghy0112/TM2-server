import express from 'express'
import {
	htppGetAllGroup,
	httpAttendGroup,
	httpCreateNewGroup,
	httpGetGroupByID,
} from './group.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const groupRouter = express.Router()

groupRouter.post('/', authorizeRouteMiddleware, httpCreateNewGroup)
groupRouter.get('/', authorizeRouteMiddleware, htppGetAllGroup)
groupRouter.get('/:id', authorizeRouteMiddleware, httpGetGroupByID)
groupRouter.get('/:groupID/attend', authorizeRouteMiddleware, httpAttendGroup)

export default groupRouter
