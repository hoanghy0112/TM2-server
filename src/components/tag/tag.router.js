import express from 'express'
import {
	httpCreateNewTag,
	httpGetTagByID,
	httpGetAllTags,
} from './tag.controller'

const tagRouter = express.Router()

tagRouter.post('/', httpCreateNewTag)
tagRouter.get('/', httpGetAllTags)
tagRouter.get('/:title', httpGetTagByID)

export default tagRouter
