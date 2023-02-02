import GroupModel from '../group/group.mongo'
import TagModel from '../tag/tag.mongo'
import UserModel from '../user/user.mongo'

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
	console.log({ result, id: newTask._id })
}

export function deleteTaskFromUser(taskID) {
	UserModel.updateMany(
		{
			tasks: taskID,
		},
		{
			$pull: {
				tasks: taskID,
			},
		},
	)
}

export function deleteTaskFromGroup(taskID) {
	GroupModel.updateOne(
		{
			tasks: taskID,
		},
		{
			$pull: {
				tasks: taskID,
			},
		},
	)
}

export function updateParticipantsOfTask(taskID, userIDs) {
	UserModel.updateMany(
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

	UserModel.updateMany(
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
