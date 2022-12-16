import io from '../../../../bin/socketServer'
import { getAllGroupsOfUser } from '../../group/group.model'
import {
	acceptJoinGroup,
	findUserByName,
	getUserInfo,
	getUserInvitations,
	getUserRequests,
	requestJoinGroup,
	updateUserInfo,
} from '../user.model'

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
		io.to(`user-info:${userID}`).emit('user-info', userInfo)
		return res.status(200).send(userInfo)
	} catch (error) {
		return res.status(400).send(error.message)
	}
}

export async function httpRequestJoinGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID

	if (!groupID) return res.status(400).send('Require group id')

	try {
		await requestJoinGroup(userID, groupID)
		return res.status(200).send('Your request has been send')
	} catch (error) {
		console.log({ error })
		return res.status(400).send('Bad request')
	}
}

export async function httpAcceptJoinGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID

	if (!groupID) return res.status(400).send('Require group id')

	try {
		await acceptJoinGroup(userID, groupID)
		return res.status(200).send('You has joined to group')
	} catch (error) {
		console.log({ error })
		return res.status(400).send('Bad request')
	}
}

export async function httpFindUserByName(req, res) {
	const name = req.query.name

	const users = await findUserByName(name)

	return res.status(200).json(users)
}

export async function httpGetUserRequests(req, res) {
	const pageIndex = req.query.page
	const userID = req.user._id

	if (!pageIndex) return res.status(400).send('Require page index')

	try {
		const requests = await getUserRequests(userID, pageIndex)
		return res.status(200).send(requests)
	} catch (error) {
		console.log({ error })
		return res.status(400).send('Bad request')
	}
}

export async function httpGetUserInvitations(req, res) {
	const pageIndex = req.query.page
	const userID = req.user._id

	if (!pageIndex) return res.status(400).send('Require page index')

	try {
		const requests = await getUserInvitations(userID, pageIndex)
		return res.status(200).send(requests)
	} catch (error) {
		console.log({ error })
		return res.status(400).send('Bad request')
	}
}

export async function socketGetAllGroup(socket, user) {
	const userID = user._id
	const groups = await getAllGroupsOfUser(userID)

	socket.join(`groups:${userID}`)
	io.to(`groups:${userID}`).emit('groups', groups)
}

export async function socketGetUserInfo(socket, user) {
	const userID = user.userID
	const userInfo = await getUserInfo(userID)
	console.log({ userInfo, userID })

	socket.join(`user-info:${user._id}`)
	io.to(`user-info:${user._id}`).emit('user-info', userInfo)
}
