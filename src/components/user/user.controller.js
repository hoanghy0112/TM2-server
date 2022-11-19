import { findUserByName, getUserInfo, updateUserInfo } from './user.model'

export async function httpGetUserInfo(req, res) {
	const userID = req.user.userID
	const userInfo = await getUserInfo(userID)
	return res.status(200).json(userInfo)
}

export async function httpUpdateUserInfo(req, res) {
	const userID = req.user._id
	const { givenName = '', familyName = '', photo = '' } = req.body
	const newData = {
		_id: userID,
		givenName,
		familyName,
		photo,
	}

	Object.keys(newData).forEach((key) =>
		obj[key] === '' ? delete obj[key] : {},
	)

	try {
		const userInfo = await updateUserInfo(newData)
		return res.status(200).send()
	} catch (error) {
		return res.status(400).send(error.message)
	}
}

export function httpTest(req, res) {
	res.status(200).json(req)
}

export async function httpFindUserByName(req, res) {
	const name = req.query.name

	const users = await findUserByName(name)

	return res.status(200).json(users)
}
