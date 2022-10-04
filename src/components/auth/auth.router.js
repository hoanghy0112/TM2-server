import express from 'express'
import passport from 'passport'

const authRouter = express.Router()

authRouter.get(
	'/google',
	passport.authenticate('google', { scope: ['email', 'profile'] }),
)

authRouter.get(
   '/google/callback',
   passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/failure'
   })
)

export default authRouter