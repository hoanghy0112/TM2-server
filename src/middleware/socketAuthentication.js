import firebaseApp from '../services/firebase'
import { getAuth } from 'firebase-admin/auth'
import { getUserInfo, createUserInfo } from '../components/user/user.model'
import { removeVietnameseTones } from '../utils/converter'

export function authorizeSocketMiddleware(socket, next) {
	const accessToken = socket.handshake.query.token

	getAuth(firebaseApp)
		.verifyIdToken(accessToken)
		.then(async (decodedToken) => {
			const uid = decodedToken.uid
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
					displayName: userProfile.displayName,
					engName: removeVietnameseTones(userProfile.displayName),
					photo: userProfile.photoURL,
					email: userProfile.email,
				}
				user = await createUserInfo(profile)
			}
			console.log({ user })

			socket.user = user

			next()
		})
		.catch((error) => {
			// Handle error
			console.log({ error })

			next('Error')
		})
}
