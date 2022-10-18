import express from 'express'
import {
	httpCreateNewTag,
	httpGetTagByID,
	httpGetAllTags,
} from './tag.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const tagRouter = express.Router()

tagRouter.post('/', authorizeRouteMiddleware, httpCreateNewTag)
tagRouter.get('/', authorizeRouteMiddleware, httpGetAllTags)
tagRouter.get('/:title', authorizeRouteMiddleware, httpGetTagByID)

export default tagRouter
