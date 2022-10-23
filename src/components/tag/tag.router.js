import express from 'express'
import {
	httpCreateNewTag,
	httpGetTagByTitle,
	httpGetAllTags,
	httpUpdateTag,
	httpRemoveTag,
	httpGetTagByID,
} from './tag.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const tagRouter = express.Router()

tagRouter.post('/', authorizeRouteMiddleware, httpCreateNewTag)
tagRouter.get('/', authorizeRouteMiddleware, httpGetAllTags)
tagRouter.get('/find', authorizeRouteMiddleware, httpGetTagByTitle)
tagRouter.get('/:tagID', authorizeRouteMiddleware, httpGetTagByID)
tagRouter.put('/:tagID', authorizeRouteMiddleware, httpUpdateTag)
tagRouter.delete('/:tagID', authorizeRouteMiddleware, httpRemoveTag)
export default tagRouter
