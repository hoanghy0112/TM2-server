import {
	addNewUserToGroup,
	createNewGroup,
	getGroupByID,
	getAllGroupsOfUser,
} from './group.model'

export async function httpCreateNewGroup(req, res) {
	const groupData = req.body

	try {
		const newGroup = await createNewGroup(groupData)
		return res.status(201).json(newGroup)
	} catch (error) {
		return res.status(400).send(error)
	}
}

export async function httpGetGroupByID(req, res) {
	const id = req.params.id

	if (!id) return res.status(400).send('Bad request')

	const group = await getGroupByID(id)

	return res.status(200).json(group)
}

export async function htppGetAllGroup(req, res) {
	const userID = req.user._id
	return res.status(200).json(await getAllGroupsOfUser(userID))
}

export async function httpAttendGroup(req, res) {
	const userID = req.user._id
	const groupID = req.params.groupID

	try {
		await addNewUserToGroup(userID, groupID)

		return res.status(202).send('Your request has been sent')
	} catch (error) {
		return res.status(400).send(error.message)
	}
}
