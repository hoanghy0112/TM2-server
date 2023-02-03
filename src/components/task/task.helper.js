import mongoose from 'mongoose'
import GroupModel from '../group/group.mongo'
import TagModel from '../tag/tag.mongo'
import UserModel from '../user/user.mongo'
import TaskModel from './task.mongo'

export function addNewTaskToUser(newTask, userIDs) {
	userIDs.forEach(async (userID) => {
		await UserModel.findByIdAndUpdate(userID, {
			$addToSet: {
				tasks: newTask._id,
			},
		})
	})
}

export async function addNewTaskToGroup(newTask, groupID) {
	const result = await GroupModel.findByIdAndUpdate(
		groupID,
		{
			$addToSet: {
				tasks: newTask._id,
			},
		},
		{ new: true },
	)
}

export async function deleteTaskFromUser(taskID) {
	const result = await UserModel.updateMany(
		{
			tasks: {
				$all: [mongoose.Types.ObjectId(taskID)],
			},
		},
		{
			$pull: {
				tasks: taskID,
			},
		},
	)
}

export async function deleteTaskFromGroup(taskID) {
	await GroupModel.updateOne(
		{
			tasks: {
				$all: [mongoose.Types.ObjectId(taskID)],
			},
		},
		{
			$pull: {
				tasks: taskID,
			},
		},
	)
}

export async function updateParticipantsOfTask(taskID, userIDs) {
	await UserModel.updateMany(
		{
			_id: {
				$nin: userIDs,
			},
		},
		{
			$pull: {
				tasks: taskID,
			},
		},
	)

	await UserModel.updateMany(
		{
			_id: {
				$in: userIDs,
			},
		},
		{
			$addToSet: {
				tasks: taskID,
			},
		},
	)
}

// export async function updateParticipantsToResponse(taskID, userIDs) {
// 	await TaskModel.findByIdAndUpdate(taskID, {
// 		$set: {
// 			tasks: taskID,
// 		},
// 	})

// 	await UserModel.updateMany(
// 		{
// 			_id: {
// 				$in: userIDs,
// 			},
// 		},
// 		{
// 			$addToSet: {
// 				tasks: taskID,
// 			},
// 		},
// 	)
// }
