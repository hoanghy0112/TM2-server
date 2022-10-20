import TagModel from './tag.mongo'
import UserModel from '../user/user.mongo'
import TaskModel from '../task/task.mongo'

export async function createNewTag(tag) {
	return await TagModel.create(tag)
}

export async function addNewTaskToTag(tag, task) {
	return await TagModel.findOneAndUpdate(
		{
			_id: tag._id,
		},
		{
			$push: { tasks: task },
		},
	)
}

export async function getTagByTitle(userID, title) {
	const user = await UserModel.findById(userID)
	const userWithTags = await user.populate('tags')
	for (let i = 0; i < userWithTags.tags.length; i++)
		if (userWithTags.tags[i].title === title)
			return userWithTags.tags[i];
	return null;
}

export async function getAllTagsOfUser(userID) {
	const user = await UserModel.findOne({ _id: userID })
	const userWithTags = await user.populate('tags')

	return userWithTags.tags
}

export async function removeTag(userID, tagID) {
	const user = await UserModel.findById(userID)
	const userWithTags = await user.populate('tags')
	let pos = -1
	for (let i = 0; i < userWithTags.tags.length; i++)
		if (userWithTags.tags[i]._id == tagID) {
			pos = i
			break
		}
	if (pos < 0)
		return false
	userWithTags.tags.splice(pos, 1)
	const tag = await TagModel.findById(tagID)
	const tagsWithTasks = await tag.populate('tasks')
	tagsWithTasks.tasks.forEach(async task => {
		let pos = -1
		for (let i = 0; i < task.tags.length; i++)
			if (task.tags[i]._id == tagID) {
				pos = i
				break
			}
		if (pos < 0)
			return false
		task.tags.splice(pos, 1)
		await TaskModel.findByIdAndUpdate(task._id, {tags: task.tags})
	})
	await UserModel.findByIdAndUpdate(userID, {tags: userWithTags.tags})
	await TagModel.findByIdAndRemove(tagID)
	return true
}