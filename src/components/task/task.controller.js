import { addNewTaskToTag } from '../tag/tag.model'
import { addNewTaskToUser } from '../user/user.model'
import {
	CreateTask,
	createNewTask,
	deleteTaskByID,
	getAllTaskOfUser,
	getTaskByID,
	updateTaskByID,
} from './task.model'

// export async function httpCreateNewTask(req, res) {
// 	const taskData = req.body
// 	const userID = req.user._id

// 	try {
// 		const newTask = await createNewTask(taskData)

// 		const { participants, tags } = newTask

// 		participants.forEach((user) => addNewTaskToUser(user, newTask))
// 		addNewTaskToUser(userID, newTask)

// 		tags.forEach((tag) => addNewTaskToTag(tag, newTask))

// 		return res.status(200).json(newTask)
// 	} catch (error) {
// 		console.log(error)
// 		return res.status(400).send(error)
// 	}
// }

export async function httpCreateNewTask(req, res) {
	const taskData = req.body
	const userID = req.user._id
	if (!userID || !taskData)
		return res.status(400).send('Bad request')
	try {
		await CreateTask(userID, taskData)
		return res.status(200).send("Create successfully")
	} catch (error) {
		return res.status(400).send(error)
	}
}


export async function httpGetTaskByID(req, res) {
	const taskID = req.params.taskID

	if (!taskID) return res.status(400).send('Bad request')

	const task = await getTaskByID(taskID)

	return res.status(200).json(task)
}

export async function httpGetAllTaskOfUser(req, res) {
	const userID = req.user._id

	return res.status(200).json(await getAllTaskOfUser(userID))
}

export async function httpUpdateTaskByID(req, res) {
	const taskID = req.params.taskID
	const taskData = req.body
	if (!taskID || !taskData)
		return res.status(400).send('Bad request')
	try {
		await updateTaskByID(taskID, taskData)
		return res.status(200).send('Update successfully')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpDeleteTaskByID(req, res) {
	const taskID = req.body.taskID
	const userID = req.user._id
	if (!userID || !taskID)
		return res.status(400).send('Bad request')
	try {
		if (await deleteTaskByID(userID, taskID))
			return res.status(200).send('Remove  successfully')
		else
			return res.status(400).send('Bad request')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}
