import TagModel from './tag.mongo'
import UserModel from '../user/user.mongo'

export async function createNewTag(tag) {
	return await TagModel.create(tag)
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

export async function getTagByTitle(title) {
	const tag = await TagModel.findOne({ title })
	if (tag) return await tag.populate('tasks')
	return {}
}

export async function getAllTagsOfUser(userID) {
	const user = await UserModel.findOne({ _id: userID })
	const userWithTags = await user.populate('tags')

	return userWithTags.tags
}
