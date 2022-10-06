import GroupModel from './group.mongo'
import UserModel from '../user/user.mongo'

export async function createNewGroup(group) {
	return await GroupModel.create(group)
}

export async function getGroupByID(groupID) {
	const groupDocument = await GroupModel.findOne({ _id: groupID })
	if (groupDocument) return await groupDocument.populate('users')
	return {}
}

export async function getAllGroupsOfUser(userID) {
	const userDocument = await UserModel.findOne({ _id: userID })
	const userWithGroups = await userDocument.populate('groups')

	return userWithGroups.groups
}

export async function addNewUserToGroup(userID, groupID) {
	const userUpdate = await UserModel.updateOne(
		{
			_id: userID,
		},
		{
			$push: { groups: groupID },
		},
	)

	const groupUpdate = await GroupModel.updateOne(
		{
			_id: groupID,
		},
		{
			$push: { users: userID },
		},
	)

	console.log(userUpdate, groupUpdate)

	if (userUpdate.acknowledged == false) throw new Error("Can't find group")
}
