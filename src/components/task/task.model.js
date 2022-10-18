import TaskModel from './task.mongo'
import UserModel from '../user/user.mongo'

export async function createNewTask(task) {
	const taskData = await TaskModel.create(task)

	return await taskData.populate('participants tags belongTo')
}

export async function getTaskByID(taskID) {
	const taskDocument = await TaskModel.findOne({ _id: taskID })
	if (taskDocument) return taskDocument.populate('participants tags belongTo')
	return {}
}

export async function getAllTaskOfUser(userID) {
	const user = await UserModel.findOne({ _id: userID })
	const populatedUser = await user.populate('tasks')

	return populatedUser.tasks
}

export async function updateTaskByID(taskID, newTask) {
	return await TaskModel.findOneAndUpdate({ _id: taskID }, newTask)
}

export async function deleteTaskByID(taskID) {
	return await TaskModel.remove({ _id: taskID })
}
