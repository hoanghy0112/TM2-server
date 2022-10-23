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
	if (pos < 0) return false
	userWithTags.tags.splice(pos, 1)
	const tag = await TagModel.findById(tagID)
	const tagsWithTasks = await tag.populate('tasks')
	tagsWithTasks.tasks.forEach(async (task) => {
		let pos = -1
		for (let i = 0; i < task.tags.length; i++)
			if (task.tags[i]._id == tagID) {
				pos = i
				break
			}
		if (pos < 0) return false
		task.tags.splice(pos, 1)
		await TaskModel.findByIdAndUpdate(task._id, { tags: task.tags })
	})
	await UserModel.findByIdAndUpdate(userID, { tags: userWithTags.tags })
	await TagModel.findByIdAndRemove(tagID)
	return true
}
