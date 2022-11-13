import GroupModel from './group.mongo'
import UserModel from '../user/user.mongo'
import TaskModel from '../task/task.mongo'
import GroupTaskModel from '../groupTask/groupTask.mongo'

export async function createNewGroup(userID, groupData) {
	const group = await GroupModel.create(groupData)
	// add gr to admin
	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			groups: group._id,
		},
	})
	// add gr to member
	group.users.forEach(
		async (userID) =>
			await UserModel.findByIdAndUpdate(userID, {
				$push: {
					groups: group._id,
				},
			}),
	)
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

// export async function addUserToGroup(userID, groupID) {

// 	const userUpdate = await UserModel.updateOne(
// 		{
// 			_id: userID,
// 		},
// 		{
// 			$push: { groups: groupID },
// 		},
// 	)

// 	const groupUpdate = await GroupModel.updateOne(
// 		{
// 			_id: groupID,
// 		},
// 		{
// 			$push: { users: userID },
// 		},
// 	)

// 	console.log(userUpdate, groupUpdate)

// 	if (userUpdate.acknowledged == false) throw new Error("Can't find group")
// }

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
}

export async function updateGroupByID(groupID, groupData) {
	await GroupModel.findByIdAndUpdate(groupID, groupData)
}

export async function deleteGroupByID(groupID) {
	const group = await GroupModel.findById(groupID)
	group.users.forEach(
		async (userID) =>
			await UserModel.findOneAndUpdate(userID, {
				$pull: {
					groups: group._id,
				},
			}),
	)
	await UserModel.findOneAndUpdate(group.admin, {
		$pull: {
			groups: group._id,
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
