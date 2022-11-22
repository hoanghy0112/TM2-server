import TaskModel from './task.mongo'
import UserModel from '../user/user.mongo'
import TagModel from '../tag/tag.mongo'

export async function getTaskByID(taskID) {
	return await TaskModel.findById(taskID)
}

export async function getAllTaskOfUser(userID) {
	const user = await UserModel.findById(userID)
	const populatedUser = await user.populate('tasks')
	return populatedUser.tasks
}

export async function updateTaskByID(userID, taskID, taskData) {
	const allTaskOfUser = await getAllTaskOfUser(userID)

	if (allTaskOfUser.find((task) => task._id == taskID)) {
		const existTag = []
		if (taskData?.tags) {
			const newTags = taskData.tags
			const task = await TaskModel.findById(taskID)
			task.tags.forEach(async (tagID) => {
				if (newTags.find((newTagID) => newTagID == tagID))
					existTag.push(tagID)
				else await removeTaskFromTag(tagID, taskID)
			})
			newTags.forEach(async (tagID) => {
				if (!existTag.find((existTagID) => existTagID == tagID))
					await addTaskToTag(tagID, taskID)
			})
		}
		await TaskModel.findByIdAndUpdate(taskID, taskData)
	} else {
		throw {
			code: 403,
		}
	}
}

export async function deleteTaskByID(userID, taskID) {
	const allTasksOfUser = await getAllTaskOfUser(userID)

	if (allTasksOfUser.find((task) => task._id == taskID)) {
		const task = await (
			await TaskModel.findByIdAndDelete(taskID)
		).populate('tags')

		// remove task from user
		await UserModel.findByIdAndUpdate(userID, {
			$pull: {
				tasks: task._id,
			},
		})

		// remove task from tags
		task.tags.forEach(async (tagID) => {
			await TagModel.findByIdAndUpdate(tagID, {
				$pull: {
					tasks: task._id,
				},
			})
		})

		return true
	} else {
		throw {
			code: 403,
		}
	}
}

export async function createNewTask(userID, task) {
	const newTask = await (await TaskModel.create(task)).populate('tags')

	// add new task to user
	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			tasks: newTask._id,
		},
	})

	// add task to tags
	newTask.tags.forEach(async (tagID) => {
		await TagModel.findByIdAndUpdate(tagID, {
			$push: {
				tasks: newTask._id,
			},
		})
	})
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
