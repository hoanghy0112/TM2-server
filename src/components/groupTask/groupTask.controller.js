import {
	addGrTaskToUser,
	createNewTask,
	deleteGrTaskByID,
	getAllGrTasksOfGroup,
	removeGrTaskFromUser,
	updateGrTaskByID,
} from './groupTask.model'
import GroupTaskModel from './groupTask.mongo'

export async function httpCreateNewTask(req, res) {
	const taskData = req.body
	const userID = req.user._id
	if (!userID || !taskData) return res.status(400).send('Bad request')
	try {
		await createNewTask(userID, taskData)
		return res.status(200).send('Create Successfully')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpGetAllGrTaskOfGroup(req, res) {
	const userID = req.user._id
	const { groupID } = req.params

	if (!userID || !groupID) return res.status(400).send('Bad request')
	try {
		const tasks = await getAllGrTasksOfGroup(groupID)
		return res.status(200).json(tasks)
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpUpdateTaskByID(req, res) {
	const taskID = req.params.taskID
	const taskData = req.body
	const userID = req.user._id
	if (!taskID || !taskData) return res.status(400).send('Bad request')
	try {
		await updateGrTaskByID(userID, taskID, taskData)
		return res.status(200).send('Update successfully')
	} catch (error) {
		if (error.code == 403) return res.status(403).send('Forbidden')
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpGetTaskByID(req, res) {
	const taskID = req.params.taskID
	if (!taskID) return res.status(400).send('Bad request')
	try {
		const task = await GroupTaskModel.findById(taskID)
		return res.status(200).json(task)
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpDeleteTaskByID(req, res) {
	const taskID = req.params.taskID
	if (!taskID) return res.status(400).send('Bad request')
	try {
		await deleteGrTaskByID(taskID)
		return res.status(200).send('Delete successfully')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpJoinTask(req, res) {
	const userID = req.user._id
	const taskID = req.params.taskID
	if (!taskID || !userID) return res.status(400).send('Bad request')
	try {
		await addGrTaskToUser(userID, taskID)
		return res.status(200).send('OK')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpQuitTask(req, res) {
	const userID = req.user._id
	const taskID = req.params.taskID
	if (!taskID || !userID) return res.status(400).send('Bad request')
	try {
		await removeGrTaskFromUser(userID, taskID)
		return res.status(200).send('OK')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}
