import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import session from 'express-session'
import MongoStore from 'connect-mongo'

import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'

import morgan from 'morgan'

import 'dotenv/config'

import api_v1 from './apiRouter/v1'

import { googleVerifyCallback } from './middleware/passport'

import { GOOGLE_OAUTH_OPTIONS } from './constants/oathOptions'

const SESSION_NAME = process.env.SESSION_NAME
const SESSION_SECRET = process.env.SESSION_SECRET
const MONGO_URL = process.env.MONGO_URL

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(helmet())

app.use(morgan('combined'))

app.use(
	session({
		name: SESSION_NAME,
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: MONGO_URL,
			collectionName: SESSION_NAME,
		}),
	}),
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((obj, done) => {
	done(null, obj)
})

passport.use(new Strategy(GOOGLE_OAUTH_OPTIONS, googleVerifyCallback))

app.use('/api/v1', api_v1)

export default app
