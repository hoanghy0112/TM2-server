import express from 'express'
import firebaseApp from '../services/firebase'
import { getAuth } from 'firebase-admin/auth'
import { getUserInfo, createUserInfo } from '../components/user/user.model'
import { removeVietnameseTones } from '../utils/converter'

export function authorizeRouteMiddleware(req, res, next) {
	const [type, accessToken] = req.headers['authorization'].split(' ')
	// console.log('authorization: ', req.headers['authorization'])
	// console.log({ type, accessToken })
	getAuth(firebaseApp)
		.verifyIdToken(accessToken)
		.then(async (decodedToken) => {
			const uid = decodedToken.uid
			// console.log({ uid })
			let user = await getUserInfo(uid)

			const userProfile = await getAuth().getUser(uid)
			if (!user) {
				const profile = {
					userID: userProfile.uid,
					givenName: userProfile.displayName.split(' ')[0],
					familyName: userProfile.displayName
						.split(' ')
						.slice(1)
						.join(' '),
					engName: removeVietnameseTones(userProfile.displayName),
					photo: userProfile.photoURL,
					email: userProfile.email,
				}
				user = await createUserInfo(profile)
			}

			req.user = user

			next()
		})
		.catch((error) => {
			// Handle error
			console.log({ error })
			return res.status(401).send('Unauthoried')
		})
}
