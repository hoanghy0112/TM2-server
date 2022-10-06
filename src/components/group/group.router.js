import express from 'express'
import {
	htppGetAllGroup,
	httpAttendGroup,
	httpCreateNewGroup,
	httpGetGroupByID,
} from './group.controller'

const groupRouter = express.Router()

groupRouter.post('/', httpCreateNewGroup)
groupRouter.get('/', htppGetAllGroup)
groupRouter.get('/:id', httpGetGroupByID)
groupRouter.get('/:groupID/attend', httpAttendGroup)

export default groupRouter
