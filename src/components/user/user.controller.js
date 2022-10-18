import { findUserByName, getUserInfo } from './user.model'

export async function httpGetUserInfo(req, res) {
	const userID = req.user.userID
	const userInfo = await getUserInfo(userID)
	return res.status(200).json(userInfo)
}

export function httpTest(req, res) {
	res.status(200).json(req)
}

export async function httpFindUserByName(req, res) {
	const name = req.query.name

	const users = await findUserByName(name)

	return res.status(200).json(users)
}
