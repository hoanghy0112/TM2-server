import { getUserInfo, createUserInfo } from '../components/user/user.model'

export async function googleVerifyCallback(
	accessToken,
	refreshToken,
	userProfile,
	done,
) {
	let user = await getUserInfo(userProfile.id)
	if (!user) {
		const profile = {
			givenName: userProfile.name.givenName,
			familyName: userProfile.name.familyName,
			photo: userProfile.photos[0].value,
			email: userProfile.emails[0].value,
		}
		user = await createUserInfo(profile)
	}
	console.log({ user })
	done(null, user)
}
