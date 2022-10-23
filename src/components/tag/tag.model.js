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
	const user = await UserModel.findById(userID)
	const userWithTags = await user.populate('tags')

	return userWithTags.tags
}

const removeTagFromTask = async (taskID, tagID) => {
	const task = await TaskModel.findById(taskID)
	let pos = -1
	for (let i = 0; i < task.tags.length; i++)
		if (task.tags[i] == tagID) {
			pos = i
			break
		}
	if (pos < 0)
		return false
	task.tags.splice(pos, 1)
	await TaskModel.findByIdAndUpdate(taskID, {tags: task.tags})
	return true
}

const addTagToTask = async (taskID, tagID) => {
	const task = await TaskModel.findById(taskID)
	task.tags.push(tagID)
	await TaskModel.findByIdAndUpdate(taskID, {tags: task.tags})
}

export async function removeTag(userID, tagID) {
	const user = await UserModel.findById(userID)
	let pos = -1
	for (let i = 0; i < user.tags.length; i++)
		if (user.tags[i] == tagID) {
			pos = i
			break
		}
	if (pos < 0)
		return false
	user.tags.splice(pos, 1)
	const tag = await TagModel.findById(tagID)
	tag.tasks.forEach(async taskID => {
		if (!await removeTagFromTask(taskID, tagID))
			return false
	})
	await UserModel.findByIdAndUpdate(userID, {tags: user.tags})
	await TagModel.findByIdAndRemove(tagID)
	return true
}