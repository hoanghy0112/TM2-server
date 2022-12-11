import GroupModel from './group.mongo'
import UserModel from '../user/user.mongo'
import TaskModel from '../task/task.mongo'
import GroupTaskModel from '../groupTask/groupTask.mongo'

import { createNotificationForJoinAndOutGroup } from '../notification/notification.model'

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
	const groupDocument = await GroupModel.findOne({ _id: groupID })
	if (groupDocument) return await groupDocument.populate('users')
	return {}
}

export async function getAllTaskOfGroup(groupID, userID, from, to) {
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
		'time.from': {
			$gt: from,
			$lt: to,
		},
	})

	const timeOfTasks = tasks.map((task) => task.time)

	return timeOfTasks
}

export async function getAllGroupsOfUser(userID) {
	const userDocument = await UserModel.findById(userID)
	const userWithGroups = await userDocument.populate('groups')
	return userWithGroups.groups
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
	await GroupModel.findByIdAndUpdate(groupID, groupData)
}

export async function deleteGroupByID(groupID) {
	const group = await GroupModel.findById(groupID)
	group.users.forEach(
		async (userID) =>
			await UserModel.findByIdAndUpdate(userID, {
				$pull: {
					groups: groupID,
				},
			}),
	)
	await UserModel.findByIdAndUpdate(group.admin, {
		$pull: {
			groups: groupID,
		},
	})
	group.groupTasks.forEach(async (taskID) => {
		const task = await GroupTaskModel.findById(taskID)
		task.participants.forEach(
			async (userID) =>
				await UserModel.findByIdAndUpdate(userID, {
					$pull: {
						groupTasks: taskID,
					},
				}),
		)
		await GroupTaskModel.findByIdAndDelete(taskID)
	})
	await GroupModel.findByIdAndDelete(groupID)
}
