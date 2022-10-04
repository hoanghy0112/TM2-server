import express from 'express'
import { httpCreateNewGroup } from './group.controller'

const groupRouter = express.Router()

groupRouter.post('/', httpCreateNewGroup)

export default groupRouter
