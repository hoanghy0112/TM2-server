import TagModel from './tag.mongo'
import UserModel from '../user/user.mongo'
import TaskModel from '../task/task.mongo'

export async function createNewTag(tag) {
	return await TagModel.create(tag)
}

export async function addNewTagToUser(userID, tag) {
	const allTagOfUser = await getAllTagsOfUser(userID)

	console.log({ allTagOfUser })

	const foundTag = allTagOfUser.find((eachTag) => eachTag.title === tag.title)

	console.log({ foundTag })

	if (!foundTag)
		throw {
			code: 11000,
			message: 'Tag has already existed',
		}

	return await UserModel.findOneAndUpdate(
		{
			_id: userID,
		},
		{
			$push: { tags: tag },
		},
	)
}

export async function addNewTagToTask(tag, task) {
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
	const tags = await user.populate('tags')

	console.log({ tags })

	const titleRegex = new RegExp(title, 'i')

	return tags.find((tag) => titleRegex.test(tag.title))

	// for (let i = 0; i < tags.tags.length; i++)
	// 	if (tags.tags[i].title === title) return tags.tags[i]
	// return null
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
