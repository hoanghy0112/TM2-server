import express from 'express'
import {
	httpFindUserByName,
	httpGetUserInfo,
	httpTest,
} from './user.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const userRouter = express.Router()

userRouter.get('/test', authorizeRouteMiddleware, httpTest)
userRouter.get('/find', httpFindUserByName)
userRouter.get('/', authorizeRouteMiddleware, httpGetUserInfo)

export default userRouter
