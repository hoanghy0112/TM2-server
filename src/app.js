import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import session from 'express-session'
import MongoStore from 'connect-mongo'

import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'

import morgan from 'morgan'

import 'dotenv/config'

import api from './apiRouter'

import { googleVerifyCallback } from './middleware/passport'

import firebaseApp from './services/firebase'

import { GOOGLE_OAUTH_OPTIONS } from './constants/oathOptions'
import authRouter from './components/auth/auth.router'
import { authorizeRouteMiddleware } from './middleware/authentication'

import cookieParser from 'cookie-parser'

const SESSION_NAME = process.env.SESSION_NAME
const SESSION_SECRET = process.env.SESSION_SECRET
const MONGO_URL = process.env.MONGO_URL

const app = express()

app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(helmet())

app.use(morgan('combined'))

// app.use(
// 	session({
// 		name: SESSION_NAME,
// 		secret: SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 		store: MongoStore.create({
// 			mongoUrl: MONGO_URL,
// 			collectionName: SESSION_NAME,
// 		}),
// 	}),
// )

// app.use(passport.initialize())
// app.use(passport.session())

// passport.serializeUser((user, done) => {
// 	done(null, user)
// })

// passport.deserializeUser((obj, done) => {
// 	done(null, obj)
// })

// passport.use(new Strategy(GOOGLE_OAUTH_OPTIONS, googleVerifyCallback))

app.use(cookieParser())

// app.use('/', authorizeRouteMiddleware)

app.use('/auth', authRouter)

app.use('/api', api)

export default app
