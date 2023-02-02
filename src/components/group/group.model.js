import TaskModel from '../task/task.mongo'
import UserModel from '../user/user.mongo'
import GroupModel from './group.mongo'

import {
	createNotificationForInviteToGroup,
	createNotificationForJoinAndOutGroup,
	createNotificationForJoinGroup,
} from '../notification/notification.model'
import { deleteTaskByID } from '../task/task.model'

export async function createNewGroup(userID, { name, description }) {
	const group = await GroupModel.create({ name, description, admin: userID })

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			groups: group._id,
		},
	})

	return group
}

export async function getGroupByID(groupID) {
	if (groupID == 'undefined') return undefined

	const groupDocument = await GroupModel.findById(groupID).select(
		'_id name description users admin',
	)

	return groupDocument
}

export async function getAllBusyTimeOfGroup(groupID, userID, from, to) {
	const group = await (
		await GroupModel.findById(groupID)
	).populate('users admin')

	const adminTaskIDs = group.admin.tasks
	const usersTaskIDs = group.users.reduce(
		(tasks, user) => [...tasks, ...user.tasks],
		[],
	)

	const allTaskIDs = [...adminTaskIDs, ...usersTaskIDs]

	const tasks = await TaskModel.find({
		_id: {
			$in: allTaskIDs,
		},
		$or: [{ belongTo: { $exists: false } }, { belongTo: { $ne: groupID } }],
		'time.from': {
			$gt: from,
			$lt: to,
		},
	})

	const timeOfTasks = tasks.map((task) => ({ ...task.time, _id: task._id }))

	return timeOfTasks
}

export async function getAllGroupsOfUser(userID) {
	const userDocument = await UserModel.findById(userID)
	const userWithGroups = await userDocument.populate('groups')
	return userWithGroups.groups
		.map((group) => ({
			_id: group._id,
			name: group.name,
			description: group.description,
			users: group.users,
			admin: group.admin,
		}))
		.reverse()
}

export async function getAllGroupTasksOfGroup(groupID, from, to) {
	const group = await GroupModel.findById(groupID)
	const populatedGroup = await group.populate('tasks')

	const now = new Date()
	const defaultFrom = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() - now.getDay() + 1,
		0,
		0,
		0,
	)
	const defaultTo = new Date(
		now.getFullYear(),
		now.getMonth(),
		defaultFrom.getDate() + 7,
		0,
		0,
		0,
	)

	return populatedGroup.tasks.filter(
		({ time }) =>
			new Date(from || defaultFrom) < new Date(time.from) &&
			new Date(to || defaultTo) > new Date(time.from),
	)
}

export async function addUserToGroup(userID, groupID) {
	await GroupModel.findByIdAndUpdate(groupID, {
		$push: {
			users: userID,
		},
	})

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			groups: groupID,
		},
	})
	await createNotificationForJoinAndOutGroup(userID, groupID, true)
}

export async function removeUserFromGroup(userID, groupID) {
	await GroupModel.findByIdAndUpdate(groupID, {
		$pull: {
			users: userID,
		},
	})
	await UserModel.findByIdAndUpdate(userID, {
		$pull: {
			groups: groupID,
		},
	})
	await createNotificationForJoinAndOutGroup(userID, groupID, false)
}

export async function updateGroupByID(groupID, groupData) {
	return await GroupModel.findByIdAndUpdate(groupID, groupData, { new: true })
}

export async function deleteGroupByID(userID, groupID) {
	const group = await GroupModel.findById(groupID)
	const memberIDs = [...group.users, group.admin]
	memberIDs.forEach((userID) => {
		UserModel.findByIdAndUpdate(group.admin, {
			$pull: {
				groups: groupID,
			},
		})
	})

	group.tasks?.forEach(async (taskID) => {
		deleteTaskByID(userID, taskID)
	})
	await GroupModel.findByIdAndDelete(groupID)
	return memberIDs
}

export async function inviteJoinGroup(adminID, userID, groupID) {
	const { invitations, admin } = await GroupModel.findById(
		groupID,
		'invitations admin',
	)

	if (String(admin) !== String(adminID))
		throw {
			msg: `${adminID} are not the admin of group ${groupID}`,
		}

	await GroupModel.findByIdAndUpdate(groupID, {
		$addToSet: {
			invitations: userID,
		},
	})

	await UserModel.findByIdAndUpdate(userID, {
		$addToSet: {
			invitations: groupID,
		},
	})

	await createNotificationForInviteToGroup(userID, groupID)
}

export async function acceptUserToJoinGroup(adminID, userID, groupID) {
	const { requests, admin } = await GroupModel.findById(
		groupID,
		'requests admin',
	)

	if (String(admin) !== String(adminID))
		throw {
			msg: `${adminID} are not the admin of group ${groupID}`,
		}

	if (!requests.map((request) => String(request)).includes(userID))
		throw {
			msg: `${userID} didn't request to group ${groupID}`,
		}

	await GroupModel.findByIdAndUpdate(groupID, {
		$pull: {
			requests: userID,
		},
		$push: {
			users: userID,
		},
	})

	await UserModel.findByIdAndUpdate(userID, {
		$pull: {
			requests: groupID,
		},
		$push: {
			groups: groupID,
		},
	})

	await createNotificationForJoinGroup(userID, groupID)
}
