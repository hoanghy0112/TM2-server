import express from 'express'
import {
	httpCreateNewTag,
	httpGetTagByTitle,
	httpGetAllTags,
	httpUpdateTag
} from './tag.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const tagRouter = express.Router()

tagRouter.post('/', authorizeRouteMiddleware, httpCreateNewTag)
tagRouter.put('/', httpUpdateTag)
tagRouter.get('/', authorizeRouteMiddleware, httpGetAllTags)
tagRouter.get('/:title', authorizeRouteMiddleware, httpGetTagByTitle)

export default tagRouter