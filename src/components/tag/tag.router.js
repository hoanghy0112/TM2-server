import express from 'express'
import {
	httpCreateNewTag,
	httpGetTagByTitle,
	httpGetAllTags,
	httpUpdateTag,
	httpRemoveTag,
} from './tag.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const tagRouter = express.Router()

tagRouter.post('/', authorizeRouteMiddleware, httpCreateNewTag)
tagRouter.put('/', authorizeRouteMiddleware, httpUpdateTag)
tagRouter.get('/', authorizeRouteMiddleware, httpGetAllTags)
tagRouter.get('/:title', authorizeRouteMiddleware, httpGetTagByTitle)
tagRouter.delete('/', authorizeRouteMiddleware, httpRemoveTag)
export default tagRouter
