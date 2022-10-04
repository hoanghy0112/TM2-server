import express from 'express'
import { httpCreateNewTag } from './tag.controller'

const tagRouter = express.Router()

tagRouter.post('/', httpCreateNewTag)

export default tagRouter
