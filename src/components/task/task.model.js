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
	const user = await UserModel.findById(userID)
	const populatedUser = await user.populate('tasks')
	return populatedUser.tasks
}

const removeTaskFromTag = async (tagID, taskID) => {
	const tag = await TagModel.findById(tagID)
	let pos = -1
	for (let i = 0; i < tag.tasks.length; i++)
		if (tag.tasks[i] == taskID) {
			pos = i
			break
		}

	if (pos < 0)
		return
	tag.tasks.splice(pos, 1)
	await TagModel.findByIdAndUpdate(tagID, { tasks: tag.tasks })
}

const addTaskToTag = async (tagID, taskID) => {
	const tag = await TagModel.findById(tagID)
	tag.tasks.push(taskID)
	await TagModel.findByIdAndUpdate(tagID, { tasks: tag.tasks })
}

export async function updateTaskByID(taskID, taskData) {
	const existTag = []
	const newTag = taskData.tags
	const task = await TaskModel.findById(taskID)
	task.tags.forEach(async tagID => {
		let isExist = false
		for (let i = 0; i < newTag.length; i++)
			if (tagID == newTag[i]) {
				isExist = true
				break
			}
		if (isExist)
			existTag.push(tagID)
		else
			await removeTaskFromTag(tagID, taskID)

	})
	newTag.forEach(async tagID => {
		let isExist = false
		for (let i = 0; i < existTag.length; i++)
			if (tagID == existTag[i]) {
				isExist = true
				break
			}
		if(!isExist)
			await addTaskToTag(tagID, taskID)
	})
	await TaskModel.findByIdAndUpdate(taskID, taskData)
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
		await TagModel.findByIdAndUpdate(tag._id, { tasks: tag.tasks })
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

	await UserModel.findByIdAndUpdate(userID, { tasks: user.tasks })

	await TaskModel.findByIdAndRemove(taskID)

	return true
}

export async function CreateTask(userID, task) {
	const newTask = await TaskModel.create(task)
	const user = await UserModel.findById(userID)
	user.tasks.push(newTask._id)
	newTask.tags.forEach(async tagID => {
		const tag = await TagModel.findById(tagID)
		tag.tasks.push(newTask._id)
		await TagModel.findByIdAndUpdate(tagID, { tasks: tag.tasks })
	})
	await UserModel.findByIdAndUpdate(userID, { tasks: user.tasks })
}
