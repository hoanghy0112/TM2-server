import { getUserInfo } from './user.model'

export async function httpGetUserInfo(req, res) {
	const userID = req.user._id
	const userInfo = await getUserInfo(userID)
	return res.status(200).json(userInfo)
}

export function httpTest(req, res) {
	res.status(200).json(req)
}
