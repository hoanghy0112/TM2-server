import { addNewTagToTask } from '../tag/tag.model'
import { addNewTaskToUser } from '../user/user.model'
import {
	createNewTask,
	deleteTaskByID,
	getAllTaskOfUser,
	getTaskByID,
	updateTaskByID,
} from './task.model'

export async function httpCreateNewTask(req, res) {
	const taskData = req.body
	const userID = req.user._id

	try {
		const newTask = await createNewTask(taskData)

		const { participants, tags } = newTask

		participants.forEach((user) => addNewTaskToUser(user, newTask))
		addNewTaskToUser(userID, newTask)

		tags.forEach((tag) => addNewTagToTask(tag, newTask))

		return res.status(201).json(newTask)
	} catch (error) {
		console.log(error)
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
	const newTask = req.body

	return res.status(200).json(await updateTaskByID(taskID, newTask))
}

export async function httpDeleteTaskByID(req, res) {
	const taskID = req.params.taskID

	await deleteTaskByID(taskID)

	return res.status(200).send()
}
