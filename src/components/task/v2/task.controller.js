import io from '../../../../bin/socketServer'
import { getUserInfo } from '../../user/user.model'
import {
	createNewTask,
	deleteTaskByID,
	getAllTaskOfUser,
	getTaskByID,
	updateTaskByID,
	changeTaskDay,
} from '../task.model'

export async function socketGetAllTaskOfUser(socket, userID, from, to) {
	socket.join(`tasks:${userID}`)

	try {
		const tasks = await getAllTaskOfUser(userID, from, to)
		io.to(`tasks:${userID}`).emit('tasks', tasks)
	} catch (error) {
		io.to(`tasks:${userID}`).emit('error', error)
	}
}

export async function socketGetTaskByID(socket, taskID) {
	socket.join(`task:${taskID}`)

	try {
		const task = await getTaskByID(taskID)
		io.to(`task:${taskID}`).emit('task', task)
	} catch (error) {
		io.to(`task:${taskID}`).emit('error', error)
	}
}

export async function httpCreateNewTask(req, res) {
	const taskData = req.body
	const participants = taskData.participants || []
	const userID = req.user._id
	const memberIDs = [userID, ...participants]

	if (!userID || !taskData) return res.status(400).send('Bad request')
	try {
		const newTask = await createNewTask([userID], taskData)
		socketSendNewTaskToParticipants(memberIDs, newTask)
		return res.status(200).send('Create successfully')
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
		const newTask = await updateTaskByID(userID, taskID, taskData)
		socketSendUpdatedTask(newTask)
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
		const deletedTask = await deleteTaskByID(userID, taskID)
		socketSendDeleteTask(taskID, deletedTask.participants)
		return res.status(200).send('Remove  successfully')
	} catch (error) {
		if (error.code == 403) return res.status(403).send('Forbidden')
		return res.status(500).send('Server error: ' + error.message)
	}
}

function socketSendNewTaskToParticipants(userIDs, task) {
	userIDs.forEach((userID) => {
		io.to(`tasks:${userID}`).emit('new-task', task)
	})
	socketUpdateBusyTime(task)
}

function socketSendUpdatedTask(task) {
	io.to(`task:${task._id}`).emit('task', task)
	socketUpdateBusyTime(task)
}

function socketSendDeleteTask(taskID, userIDs) {
	userIDs.forEach((userID) => {
		io.to(`tasks:${userID}`).emit('delete-task', taskID)
	})

	io.to(`task:${taskID}`).emit('delete-task', taskID)
	socketDeleteBusyTime(taskID)
}

async function socketUpdateBusyTime(task) {
	const groupIDs = await getAllGroupIDOfTask(task._id)

	groupIDs.forEach((groupID) => {
		io.to(`busy:${groupID}`).emit('update-task', task)
	})
}

async function socketDeleteBusyTime(taskID) {
	const groupIDs = await getAllGroupIDOfTask(taskID)

	groupIDs.forEach((groupID) => {
		io.to(`busy:${groupID}`).emit('delete-task', taskID)
	})
}

async function getAllGroupIDOfTask(taskID) {
	const task = await getTaskByID(taskID)

	const belongTo = task?.belongTo
	const memberIDs = [task.admin, ...task.participants]
	const groupIDs = new Set([belongTo])
	await Promise.all(
		memberIDs.map(async (memberID) => {
			const memberInfo = await getUserInfo(memberID)
			memberInfo.groups?.forEach((groupID) => groupIDs.add(groupID))
		}),
	)

	return groupIDs
}
