import { addNewTagToTask } from '../tag/tag.model'
import { addNewTaskToUser } from '../user/user.model'
import { createNewTask } from './task.model'

export async function httpCreateNewTask(req, res) {
	const taskData = req.body

	try {
		const newTask = await createNewTask(taskData)

		const { participants, tags } = newTask

		participants.forEach((user) => addNewTaskToUser(user, newTask))

		tags.forEach((tag) => addNewTagToTask(tag, newTask))

		return res.status(201).json(newTask)
	} catch (error) {
		console.log(error)
		return res.status(400).send(error)
	}
}
