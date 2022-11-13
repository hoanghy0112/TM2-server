import GroupModel from '../group/group.mongo'
import UserModel from '../user/user.mongo'
import GroupTaskModel from './groupTask.mongo'

export async function createNewTask(userID, taskData) {
	const newTask = await GroupTaskModel.create(taskData)
	const groupID = newTask.belongTo
	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			groupTasks: newTask._id,
		},
	})
	await GroupModel.findByIdAndUpdate(groupID, {
		$push: {
			groupTasks: newTask._id,
		},
	})
}

export async function getAllGrTasksOfUser(userID) {
	const user = await UserModel.findById(userID)
	const userWithGroupTasks = await user.populate('groupTasks')
	return userWithGroupTasks.groupTasks
}

export async function updateGrTaskByID(taskID, taskData) {
	await GroupTaskModel.findByIdAndUpdate(taskID, taskData)
}

export async function deleteGrTaskByID(taskID) {
	const task = await GroupTaskModel.findById(taskID)
	task.participants.forEach(
		async (userID) =>
			await UserModel.findByIdAndUpdate(userID, {
				$pull: {
					groupTasks: taskID,
				},
			}),
	)
	const groupID = task.belongTo
	await GroupModel.findByIdAndUpdate(groupID, {
		$pull: {
			groupTasks: taskID,
		},
	})
	await GroupTaskModel.findByIdAndDelete(taskID)
}

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
}
