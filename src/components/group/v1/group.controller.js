import {
	addUserToGroup,
	removeUserFromGroup,
	createNewGroup,
	getGroupByID,
	getAllGroupsOfUser,
	updateGroupByID,
	deleteGroupByID,
	getAllTaskOfGroup,
} from '../group.model'
import GroupModel from '../group.mongo'

export async function httpCreateNewGroup(req, res) {
	const userID = req.user._id
	const groupData = req.body
	if (!userID || !groupData) return res.status(400).send('Bad request')
	try {
		const newGroup = await createNewGroup(userID, groupData)
		return res.status(200).json(newGroup)
	} catch (error) {
		return res.status(500).send(error)
	}
}

export async function httpGetGroupByID(req, res) {
	const id = req.params.id

	if (!id) return res.status(400).send('Bad request')

	const group = await getGroupByID(id)

	return res.status(200).json(group)
}

export async function httpGetAllTaskOfGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID
	const from = req.query.from
	const to = req.query.to

	if (!userID || !groupID || !from || !to)
		return res.status(400).send('Bad request')
	try {
		const tasks = await getAllTaskOfGroup(groupID, userID, from, to)
		return res.status(200).json(tasks)
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function htppGetAllGroup(req, res) {
	const userID = req.user._id
	return res.status(200).json(await getAllGroupsOfUser(userID))
}

// thay đổi mem thì chỉ có admin ms dc
export async function httpAddUserToGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID
	const members = req.body.members
	if (!userID || !groupID || !members)
		return res.status(400).send('Bad Request')
	const group = await GroupModel.findById(groupID)
	if (!userID.equals(group.admin)) return res.status(401).send('Unauthorized')
	try {
		members.forEach(
			async (memberID) => await addUserToGroup(memberID, groupID),
		)
		return res.status(202).send('Added')
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
	const group = await GroupModel.findById(groupID)
	if (!userID.equals(group.admin)) return res.status(401).send('Unauthorized')
	try {
		await removeUserFromGroup(memberID, groupID)
		return res.status(202).send('Removed user')
	} catch (error) {
		return res.status(500).send(error.message)
	}
}

// update chung như name, desc mọi member đều dc, ko dc update memebers
export async function httpUpdateGroup(req, res) {
	const groupID = req.params.groupID
	const groupData = req.body
	if (!userID || !groupID) return res.status(400).send('Bad Request')
	try {
		await updateGroupByID(groupID, groupData)
		return res.status(200).send('Update Successfully')
	} catch (error) {
		return res.status(500).send(error.message)
	}
}

export async function httpDeleteGroupByID(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID
	if (!userID || !groupID) return res.status(400).send('Bad Request')
	const group = await GroupModel.findById(groupID)
	if (!userID.equals(group.admin)) return res.status(401).send('Unauthorized')
	try {
		await deleteGroupByID(groupID)
		return res.status(200).send('Delete Successfully')
	} catch (error) {
		return res.status(500).send(error.message)
	}
}
