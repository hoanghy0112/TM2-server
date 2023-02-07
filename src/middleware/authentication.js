import express from 'express'
import firebaseApp from '../services/firebase'
import { getAuth } from 'firebase-admin/auth'
import { getUserInfo, createUserInfo } from '../components/user/user.model'
import { removeVietnameseTones } from '../utils/converter'

export function authorizeRouteMiddleware(req, res, next) {
	const [type, accessToken] = req.headers['authorization'].split(' ')

	getAuth(firebaseApp)
		.verifyIdToken(accessToken)
		.then(async (decodedToken) => {
			const uid = decodedToken.uid
			let user = await getUserInfo(uid)

			if (!user) {
				const userProfile = await getAuth(firebaseApp).getUser(uid)

				const profile = userProfile?.displayName
					? {
							userID: userProfile.uid,
							givenName: userProfile?.displayName?.split(' ')[0] || '',
							familyName:
								userProfile?.displayName
									?.split(' ')
									.slice(1)
									.join(' ') || '',
							displayName: userProfile?.displayName,
							engName: removeVietnameseTones(
								userProfile?.displayName || '',
							),
							photo: userProfile?.photoURL || '',
							email: userProfile?.email || '',
					  }
					: {}
				user = await createUserInfo(profile)
			}

			req.user = user

			next()
		})
		.catch((error) => {
			console.log({ error })
			return res.status(401).send('Unauthoried')
		})
}
