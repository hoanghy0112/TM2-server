import { createNewTask } from './task.model'

export async function httpCreateNewTask(req, res) {
	const taskData = req.body

	if (!req.user) {
		return res.status(401).send('Unauthorized')
	}

	try {
		const newTask = await createNewTask(taskData)
		return res.status(201).json(newTask)
	} catch (error) {
		return res.status(400).send(error)
	}
}
