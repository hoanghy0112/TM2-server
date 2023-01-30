import GroupModel from '../group/group.mongo'
import UserModel from '../user/user.mongo'
import GroupTaskModel from './groupTask.mongo'
import TaskModel from '../task/task.mongo'

import {
	createNotificationForCreateAndUpdateTask,
	createNotificationForJoinAndQuitTask,
} from '../notification/notification.model'

export async function createNewTask(userID, taskData) {
	const newTask = await TaskModel.create(taskData)
	const groupID = newTask.belongTo

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			tasks: newTask._id,
		},
	})

	await GroupModel.findByIdAndUpdate(groupID, {
		$push: {
			tasks: newTask._id,
		},
	})

	await createNotificationForCreateAndUpdateTask(
		userID,
		groupID,
		'vừa tạo một task mới!',
	)
}

export async function getAllGrTasksOfGroup(groupID) {
	console.log({ groupID })
	try {
		const group = await GroupModel.findById(groupID)
		const groupWithTask = await group.populate('tasks')
		return groupWithTask.tasks
	} catch {
		throw 'cannot populate'
	}
}

export async function updateGrTaskByID(userID, taskID, taskData) {
	const participants = taskData.participants || []
	const oldTask = await TaskModel.findById(taskID)

	const newParticipants = participants.filter(
		(x) => !oldTask.participants.includes(x),
	)
	const deleteParticipants = oldTask.participants.filter(
		(x) => !participants.includes(x),
	)

	newParticipants.forEach((userID) =>
		UserModel.findByIdAndUpdate(userID, {
			$push: {
				taskID,
			},
		}),
	)

	deleteParticipants.forEach((userID) =>
		UserModel.findByIdAndUpdate(userID, {
			$pull: {
				taskID,
			},
		}),
	)

	await TaskModel.findByIdAndUpdate(taskID, taskData)
	const grTask = await TaskModel.findById(taskID)
	await createNotificationForCreateAndUpdateTask(
		userID,
		grTask.belongTo,
		'vừa cập nhật task!',
	)
}

export async function deleteGrTaskByID(taskID) {
	const task = await TaskModel.findById(taskID)
	task.participants.forEach(
		async (userID) =>
			await UserModel.findByIdAndUpdate(userID, {
				$pull: {
					tasks: taskID,
				},
			}),
	)

	const groupID = task.belongTo
	await GroupModel.findByIdAndUpdate(groupID, {
		$pull: {
			tasks: taskID,
		},
	})
	await GroupTaskModel.findByIdAndDelete(taskID)
}

// Deprecated

export async function addGrTaskToUser(userID, taskID) {
	await GroupTaskModel.findByIdAndUpdate(taskID, {
		$push: {
			participants: userID,
		},
	})
	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			groupTasks: taskID,
		},
	})
	await createNotificationForJoinAndQuitTask(userID, taskID, true)
}

export async function removeGrTaskFromUser(userID, taskID) {
	await GroupTaskModel.findByIdAndUpdate(taskID, {
		$pull: {
			participants: userID,
		},
	})
	await UserModel.findByIdAndUpdate(userID, {
		$pull: {
			groupTasks: taskID,
		},
	})
	await createNotificationForJoinAndQuitTask(userID, taskID, false)
}
