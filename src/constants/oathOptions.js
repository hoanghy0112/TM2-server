import { GOOGLE_CALLBACK_URL } from './link'

export const GOOGLE_OAUTH_OPTIONS = {
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: GOOGLE_CALLBACK_URL,
}
