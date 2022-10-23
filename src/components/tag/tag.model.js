import TagModel from './tag.mongo'
import UserModel from '../user/user.mongo'
import TaskModel from '../task/task.mongo'
import { removeVietnameseTones } from '../../utils/converter'

export async function createNewTag(tag) {
	return await TagModel.create(tag)
}

export async function addNewTagToUser(userID, tag) {
	const allTagOfUser = await getAllTagsOfUser(userID)

	const foundTag = allTagOfUser.find((eachTag) => eachTag.title === tag.title)

	if (foundTag)
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
	const tags = await getAllTagsOfUser(userID)

	const titleRegex = new RegExp(removeVietnameseTones(title), 'i')

	return (
		tags.find((tag) => titleRegex.test(removeVietnameseTones(tag.title))) ||
		[]
	)
}

export async function getAllTagsOfUser(userID) {
	const user = await UserModel.findOne({ _id: userID })
	const userWithTags = await user.populate('tags')

	return userWithTags.tags
}

export async function updateTagByID(userID, tagID, tagData) {
	const allTagOfUser = await getAllTagsOfUser(userID)

	if (allTagOfUser.find((tag) => tag._id == tagID))
		return TagModel.findByIdAndUpdate(tagID, tagData)

	throw {
		code: 403,
	}
}

export async function removeTag(userID, tagID) {
	const allTagOfUser = await getAllTagsOfUser(userID)

	if (allTagOfUser.find((tag) => tag._id == tagID)) {
		const tag = await TagModel.findByIdAndDelete(tagID)
		console.log({ tag })

		await UserModel.findOneAndUpdate(
			{ _id: userID },
			{
				$pull: {
					tags: tagID,
				},
			},
		)

		return
	}

	throw {
		code: 403,
	}
}
