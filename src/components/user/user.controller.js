import { getUserInfo } from './user.model'

export async function httpGetUserInfo(req, res) {
	if (req.user) {
		const userID = req.user.userID
		const userInfo = await getUserInfo(userID)
		return res.status(200).json(userInfo)
	}
	return res.status(401).json({
		error: 'Unauthenticated',
	})
}

export function httpTest(req, res) {
   res.status(200).json(req)
}