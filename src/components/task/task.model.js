import TaskModel from './task.mongo'
import UserModel from '../user/user.mongo'
import TagModel from '../tag/tag.mongo'

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

export async function deleteTaskByID(userID, taskID) {
	const user = await UserModel.findById(userID)

	const task = await TaskModel.findById(taskID)

	const taskWithTags = await task.populate('tags')

	taskWithTags.tags.forEach(async tag => {
		let pos = -1
		for (let i = 0; i < tag.tasks.length; i++)
			if (tag.tasks[i]._id == taskID) {
				pos = i;
				break;
			}
		if (pos < 0)
			return false;
		tag.tasks.splice(pos, 1)
		await TagModel.findByIdAndUpdate(tag._id, {tasks: tag.tasks})
	});

	let pos = -1
	
	for (let i = 0; i < user.tasks.length; i++)
		if (user.tasks[i] == taskID) {
			pos = i;
			break;
		}
	
	if (pos < 0)
		return false;

	user.tasks.splice(pos, 1)

	await UserModel.findByIdAndUpdate(userID, {tasks: user.tasks})

	await TaskModel.findByIdAndRemove(taskID)

	return true
}
