import express from 'express'
import { httpGetAllGivenName, httpGetUserInfo } from './user.controller'

const userRouter = express.Router()

userRouter.get('/profile', httpGetUserInfo)

export default userRouter
