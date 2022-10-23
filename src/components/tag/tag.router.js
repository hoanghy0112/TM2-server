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
tagRouter.get('/all', authorizeRouteMiddleware, httpGetAllTags)
tagRouter.get('/', authorizeRouteMiddleware, httpGetTagByTitle)
tagRouter.put('/:tagID', authorizeRouteMiddleware, httpUpdateTag)
tagRouter.delete('/:tagID', authorizeRouteMiddleware, httpRemoveTag)
export default tagRouter
