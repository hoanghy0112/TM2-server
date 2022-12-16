import GroupModel from '../group/group.mongo'
import { createNotificationForJoinGroup } from '../notification/notification.model'
import UserModel from './user.mongo'

export async function getUserInfo(userID) {
	const userInfo = await UserModel.findOne({ userID }).select(
		'_id userID givenName familyName email photo',
	)
	return userInfo
}

export async function getUserRequests(userID, pageIndex) {
	const userWithRequests = await UserModel.findOne(
		{ _id: userID },
		'requests',
		{
			limit: 10,
			skip: 10 * pageIndex,
		},
	)
	return userWithRequests.requests
}

export async function getUserInvitations(userID, pageIndex) {
	const userWithInvitations = await UserModel.findOne(
		{
			_id: userID,
		},
		'invitations',
		{
			limit: 10,
			skip: 10 * pageIndex,
		},
	)
	return userWithInvitations.invitations
}

export async function updateUserInfo(userInfo) {
	return await UserModel.findOneAndUpdate(
		{
			_id: userInfo._id,
		},
		userInfo,
		{
			upsert: false,
			new: true,
		},
	)
}

export async function addNewTaskToUser(user, task) {
	return await UserModel.findOneAndUpdate(
		{
			_id: user._id,
		},
		{
			$push: { tasks: task },
		},
	)
}

export async function createUserInfo(userInfo) {
	const { userID } = userInfo

	const userInstance = await UserModel.create(userInfo)
	const { _id } = userInstance

	await UserModel.deleteMany({ userID, _id: { $ne: _id } })

	return userInstance
}

export async function findUserByName(name) {
	const nameRegex = `${name}`
	return await UserModel.find({
		$or: [
			{ engName: new RegExp(nameRegex, 'i') },
			{ email: new RegExp(nameRegex, 'i') },
			{ givenName: new RegExp(nameRegex, 'i') },
			{ familyName: new RegExp(nameRegex, 'i') },
		],
	}).select('_id givenName familyName email photo')
}

export async function requestJoinGroup(userID, groupID) {
	const { requests } = await GroupModel.findById(groupID, 'requests')

	if (requests.map((request) => String(request)).includes(String(userID)))
		return

	await GroupModel.findByIdAndUpdate(groupID, {
		$push: {
			requests: userID,
		},
	})

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			requests: groupID,
		},
	})
}

export async function acceptJoinGroup(userID, groupID) {
	const { invitations } = await GroupModel.findById(groupID, 'invitations')
	console.log({ invitations, userID })

	if (
		!invitations
			.map((invitation) => String(invitation))
			.includes(String(userID))
	)
		throw {
			msg: `${userID} is not invited to group ${groupID}`,
		}

	await GroupModel.findByIdAndUpdate(groupID, {
		$pull: {
			invitations: userID,
		},
		$push: {
			users: userID,
		},
	})

	await UserModel.findByIdAndUpdate(userID, {
		$pull: {
			invitations: groupID,
		},
		$push: {
			groups: groupID,
		},
	})

	await createNotificationForJoinGroup(userID, groupID)
}
