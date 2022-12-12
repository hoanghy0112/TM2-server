import io from '../../../../bin/socketServer'
import { getAllGroupsOfUser } from '../../group/group.model'
import { findUserByName, getUserInfo, updateUserInfo } from '../user.model'

export async function socketGetUserInfo(socket, userID) {
	const userInfo = await getUserInfo(userID)

	socket.join(`user-info:${user._id}`)
	io.to(`user-info:${userID}`).emit('data', userInfo)
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
		newData[key] === '' ? delete newData[key] : {},
	)

	try {
		const userInfo = await updateUserInfo(newData)
		io.to(`user:${userID}`).emit('user-info', userInfo)
		return res.status(200).send(userInfo)
	} catch (error) {
		return res.status(400).send(error.message)
	}
}

export async function httpFindUserByName(req, res) {
	const name = req.query.name

	const users = await findUserByName(name)

	return res.status(200).json(users)
}

export async function socketGetAllGroup(socket, user) {
	const userID = user._id
	const groups = getAllGroupsOfUser(userID)
	
	socket.join(`groups`)
	io.to(`groups:${userID}`).emit('data', groups)
}
