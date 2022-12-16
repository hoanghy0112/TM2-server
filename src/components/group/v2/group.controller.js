import io from '../../../../bin/socketServer'
import {
	addUserToGroup,
	removeUserFromGroup,
	createNewGroup,
	getGroupByID,
	getAllGroupsOfUser,
	updateGroupByID,
	deleteGroupByID,
	getAllBusyTimeOfGroup,
	inviteJoinGroup,
	acceptUserToJoinGroup,
} from '../group.model'

export async function socketGetGroupByID(socket, groupID) {
	if (!groupID) return

	const group = await getGroupByID(groupID)

	socket.join(`group:${groupID}`)
	updateGroupInfoToSocket(group)
}

export async function httpCreateNewGroup(req, res) {
	const userID = req.user._id
	const groupData = req.body

	if (!userID || !groupData) return res.status(400).send('Bad request')

	try {
		const newGroup = await createNewGroup(userID, groupData)
		const groups = await getAllGroupsOfUser(userID)
		io.to(`groups:${userID}`).emit('groups', groups)
		return res.status(200).json(newGroup)
	} catch (error) {
		return res.status(500).send(error)
	}
}

export async function httpGetAllBusyTimeOfGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID
	const from = req.query.from
	const to = req.query.to

	if (!userID || !groupID || !from || !to)
		return res.status(400).send('Bad request')

	try {
		const busyTimes = await getAllBusyTimeOfGroup(groupID, userID, from, to)
		return res.status(200).json(busyTimes)
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpInviteJoinGroup(req, res) {
	const adminID = req.user._id
	const userIDs = req.body.users
	const groupID = req.params.groupID

	if (!groupID) return res.status(400).send('Require group id')

	try {
		await Promise.all(
			userIDs.map(
				async (userID) => await inviteJoinGroup(adminID, userID, groupID),
			),
		)
		return res.status(200).send('Your request has been send')
	} catch (error) {
		console.log({ error })
		return res.status(400).send('Bad request')
	}
}

export async function httpAcceptUserToJoinGroup(req, res) {
	const adminID = req.user._id
	const userIDs = req.body.users
	const groupID = req.params.groupID

	if (!groupID) return res.status(400).send('Require group id')

	try {
		await Promise.all(
			userIDs.map(
				async (userID) =>
					await acceptUserToJoinGroup(adminID, userID, groupID),
			),
		)
		updateGroupInfoToSocketByID(groupID)
		return res.status(200).send('You has joined to group')
	} catch (error) {
		console.log({ error })
		return res.status(400).send(error?.msg || 'Bad request')
	}
}

export async function httpAddUserToGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID
	const members = req.body.members

	if (!userID || !groupID || !members)
		return res.status(400).send('Bad Request')

	const group = await getGroupByID(groupID)

	if (!group) return res.status(400).send('Bad Request')

	if (!userID.equals(group.admin))
		return res.status(400).send('You are not admin')

	try {
		await Promise.all(
			members.map(
				async (memberID) => await addUserToGroup(memberID, groupID),
			),
		)

		const newGroup = await getGroupByID(groupID)
		updateGroupInfoToSocket(newGroup)

		return res.status(200).send('Added')
	} catch (error) {
		return res.status(500).send(error.message)
	}
}

export async function httpRemoveUserFromGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID
	const memberID = req.params.memberID

	if (!userID || !groupID || !memberID)
		return res.status(400).send('Bad Request')

	const group = await getGroupByID(groupID)

	if (!group) return res.status(400).send('Bad Request')

	if (!userID.equals(group.admin))
		return res.status(400).send('You are not admin')

	try {
		await removeUserFromGroup(memberID, groupID)

		updateGroupInfoToSocketByID(groupID)

		return res.status(200).send('Removed user')
	} catch (error) {
		return res.status(500).send(error.message)
	}
}

export async function httpUpdateGroup(req, res) {
	const groupID = req.params.groupID
	const groupData = req.body

	if (!userID || !groupID) return res.status(400).send('Bad Request')

	const group = await getGroupByID(groupID)

	if (!group) return res.status(400).send('Bad Request')

	if (!userID.equals(group.admin))
		return res.status(400).send('You are not admin')

	try {
		const newGroup = await updateGroupByID(groupID, groupData)
		updateGroupInfoToSocket(newGroup)

		return res.status(200).send('Update Successfully')
	} catch (error) {
		return res.status(500).send(error.message)
	}
}

export async function httpDeleteGroupByID(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID

	if (!userID || !groupID) return res.status(400).send('Bad Request')

	const group = await getGroupByID(groupID)

	if (!group) return res.status(400).send('Bad Request')

	if (!userID.equals(group.admin))
		return res.status(400).send('You are not admin')

	try {
		await deleteGroupByID(groupID)

		const groups = await getAllGroupsOfUser(userID)
		io.to(`groups:${userID}`).emit('groups', groups)

		return res.status(200).send('Delete Successfully')
	} catch (error) {
		return res.status(500).send(error.message)
	}
}

export function updateGroupInfoToSocket(group) {
	const { _id: groupID } = group
	io.to(`group:${groupID}`).emit('group-info', group)
}

export async function updateGroupInfoToSocketByID(groupID) {
	const group = await getGroupByID(groupID)
	io.to(`group:${groupID}`).emit('group-info', group)
}

export function updateGroupBusyTimeToSocket(newBusyTime) {
	io.to(`group-busy:${groupID}`).emit('group-busy', newBusyTime)
}
