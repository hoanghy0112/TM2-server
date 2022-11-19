import express from 'express'
import {
	httpFindUserByName,
	httpGetUserInfo,
	httpTest,
	httpUpdateUserInfo,
} from './user.controller'

import { authorizeRouteMiddleware } from '../../middleware/authentication'

const userRouter = express.Router()

userRouter.get('/test', authorizeRouteMiddleware, httpTest)
userRouter.get('/find', httpFindUserByName)
userRouter.get('/', authorizeRouteMiddleware, httpGetUserInfo)
userRouter.put('/', authorizeRouteMiddleware, httpUpdateUserInfo)

export default userRouter
