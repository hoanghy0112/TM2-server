import TaskModel from './task.mongo'
import UserModel from '../user/user.mongo'
import TagModel from '../tag/tag.mongo'

export async function getTaskByID(taskID, userID) {
	const task = await TaskModel.findOne({
		$and: [
			{ _id: taskID },
			userID
				? {
						$or: [
							{
								'permission.view': {
									$all: [userID],
								},
							},
							{
								participants: {
									$all: [userID],
								},
							},
						],
				  }
				: {},
		],
	})
	if (!task) {
		throw {
			code: 403,
		}
	} else {
		return task
	}
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
	const oldTask = await TaskModel.findById(taskID)
	const newTask = await TaskModel.findOneAndUpdate(
		{
			$and: [
				{ _id: taskID },
				{
					'permission.edit': {
						$all: [userID],
					},
				},
			],
		},
		taskData,
		{
			new: true,
		},
	)
	if (!newTask) {
		throw {
			code: 403,
		}
	}
	return { oldTask, newTask }
}

export async function deleteTaskByID(userID, taskID) {
	const task = await TaskModel.findById(taskID)
	const deletedTask = await TaskModel.findOneAndDelete({
		$and: [
			{ _id: taskID },
			{
				admin: {
					$all: [userID],
				},
			},
		],
	})

	if (!deletedTask) {
		throw {
			code: 403,
		}
	}

	return task
}

export async function responseTask(taskID, userID, message, state) {
	const oldTask = await TaskModel.findOneAndUpdate(
		{
			$and: [
				{ _id: taskID },
				{
					participants: {
						$all: [userID],
					},
				},
				{
					'responses.userID': { $ne: userID },
				},
			],
		},
		{
			$push: {
				responses: {
					userID,
					message,
					state,
				},
			},
		},
	)

	const task = await TaskModel.findOneAndUpdate(
		{
			$and: [
				{ _id: taskID },
				{
					participants: {
						$all: [userID],
					},
				},
				{
					'responses.userID': userID,
				},
			],
		},
		{
			$set: {
				'responses.$.message': message,
				'responses.$.state': state,
			},
		},
		{ new: true },
	)
	if (!task) {
		throw {
			code: 403,
		}
	} else {
		return task
	}
}

export async function responseUserRequestOfTask(
	taskID,
	userID,
	participantID,
	state,
) {
	const task = await TaskModel.findOneAndUpdate(
		{
			$and: [
				{ _id: taskID },
				{
					admin: userID,
				},
				{
					'responses.userID': participantID,
				},
			],
		},
		{
			$set: {
				'responses.$.adminState': state,
			},
		},
		{ new: true },
	)
	if (!task) {
		throw {
			code: 403,
		}
	} else {
		return task
	}
}

export async function createNewTask(userID, task) {
	const newTask = await TaskModel.create({
		...task,
		participants: [
			...(task?.belongTo ? [] : [userID]),
			...(task?.participants || []),
		],
		admin: userID,
		permission: {
			view: [userID],
			edit: [userID],
		},
	})
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
