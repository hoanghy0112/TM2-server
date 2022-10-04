import express from 'express'
import { httpGetUserInfo, httpTest } from './user.controller'

const userRouter = express.Router()

userRouter.get('/test', httpTest)
userRouter.get('/', httpGetUserInfo)

export default userRouter
