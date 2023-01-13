// import { addNewTaskToTag } from '../tag/tag.model'
// import { addNewTaskToUser } from '../user/user.model'
import {
	createNewTask,
	deleteTaskByID,
	getAllTaskOfUser,
	getTaskByID,
	updateTaskByID,
	changeTaskDay,
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
	if (!userID || !taskData) return res.status(400).send('Bad request')
	try {
		await createNewTask([userID], taskData)
		return res.status(200).send('Create successfully')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpGetTaskByID(req, res) {
	const taskID = req.params.taskID
	if (!taskID) return res.status(400).send('Bad request')
	try {
		const task = await getTaskByID(taskID)
		return res.status(200).json(task)
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpGetAllTaskOfUser(req, res) {
	const userID = req.user._id
	const { from, to } = req.query

	if (!userID) return res.status(400).send('Bad request')
	try {
		const tasks = await getAllTaskOfUser(userID, from, to)
		return res.status(200).json(tasks)
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpUpdateTaskByID(req, res) {
	const userID = req.user._id
	const taskID = req.params.taskID
	const taskData = req.body

	if (!taskID || !taskData) return res.status(400).send('Bad request')
	try {
		await updateTaskByID(userID, taskID, taskData)
		return res.status(200).send('Update successfully')
	} catch (error) {
		if (error.code == 403) return res.status(403).send('Forbidden')
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpDeleteTaskByID(req, res) {
	const taskID = req.params.taskID
	const userID = req.user._id

	try {
		if (await deleteTaskByID(userID, taskID))
			return res.status(200).send('Remove  successfully')
		else return res.status(400).send('Bad request')
	} catch (error) {
		if (error.code == 403) return res.status(403).send('Forbidden')
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpChangeDay(req, res) {
	const taskID = req.params.taskID
	const taskData = req.body.taskData
	if (!taskID || !taskData) return res.status(400).send('Bad request')
	try {
		await changeTaskDay(taskID, taskData)
		return res.status(200).send('Update successfully')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}
