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