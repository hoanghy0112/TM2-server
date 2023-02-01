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

export function addNewTaskToTag(newTask, tagIDs) {
	tagIDs.forEach(async (tagID) => {
		await TagModel.findByIdAndUpdate(tagID, {
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

export function updateTask(taskID, updatedFields) {
	const fields = Array.from(Object.entries(updatedFields))

	const tagRegEx = /^tags.\d+$/

	// fields.forEach(([key, value]) => {
	//    if (tagRegEx.test(key))
	// })
}
