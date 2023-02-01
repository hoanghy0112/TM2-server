import TaskModel from './task.mongo'
import UserModel from '../user/user.mongo'
import TagModel from '../tag/tag.mongo'

export async function getTaskByID(taskID) {
	return await TaskModel.findById(taskID)
}

export async function getAllTaskOfUser(userID, from, to) {
	const user = await UserModel.findById(userID)
	const populatedUser = await user.populate('tasks')

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

	return populatedUser.tasks.filter(
		({ time }) =>
			new Date(from || defaultFrom) < new Date(time.from) &&
			new Date(to || defaultTo) > new Date(time.from),
	)
}

export async function updateTaskByID(userID, taskID, taskData) {
	const allTaskOfUser = await getAllTaskOfUser(userID)

	if (allTaskOfUser.find((task) => task._id == taskID)) {
		// const existTag = []
		// if (taskData?.tags) {
		// 	const newTags = taskData.tags
		// 	const task = await TaskModel.findById(taskID)
		// 	task.tags.forEach(async (tagID) => {
		// 		if (newTags.find((newTagID) => newTagID == tagID))
		// 			existTag.push(tagID)
		// 		else await removeTaskFromTag(tagID, taskID)
		// 	})
		// 	newTags.forEach(async (tagID) => {
		// 		if (!existTag.find((existTagID) => existTagID == tagID))
		// 			await addTaskToTag(tagID, taskID)
		// 	})
		// }
		return await TaskModel.findByIdAndUpdate(taskID, taskData, { new: true })
	} else {
		throw {
			code: 403,
		}
	}
}

export async function deleteTaskByID(userID, taskID) {
	const allTasksOfUser = await getAllTaskOfUser(userID)

	if (allTasksOfUser.find((task) => task._id == taskID)) {
		const task = TaskModel.findById(taskID)
		await TaskModel.findByIdAndDelete(taskID)

		return task
	} else {
		throw {
			code: 403,
		}
	}
}

export async function createNewTask(userIDs, task) {
	const newTask = await TaskModel.create({
		...task,
		participants: [...userIDs, ...(task?.participants || [])],
	})
	// console.log({ newTask })
	return newTask
}

export async function removeTaskFromTag(tagID, taskID) {
	await TagModel.findByIdAndUpdate(tagID, {
		$pull: {
			tasks: taskID,
		},
	})
}

export async function addTaskToTag(tagID, taskID) {
	await TagModel.findByIdAndUpdate(tagID, {
		$push: {
			tasks: taskID,
		},
	})
}

// const changeDay = (date, newDate) => {
// 	const a = date.getDay()
// 	a.setHours(a.getHours()+7)
// 	const b = newDate.getDay()
// 	console.log(date, newDate)
// 	console.log(a, b)
// 	if (b != 0) {
// 		if (a != 0)
// 			date.setDate(date.getDate() + b - a)
// 		else
// 			date.setDate(date.getDate() - b + 1)
// 	}
// 	else
// 		date.setDate(date.getDate() + 7 - (a != 0 ? a : 7))
// }

export async function changeTaskDay(taskID, taskData) {
	await TaskModel.findByIdAndUpdate(taskID, taskData)
}
