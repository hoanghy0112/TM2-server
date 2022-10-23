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
	const user = await UserModel.findById(userID)
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

export async function updateTagByID(tagID, tagData) {
	const existTask = []
	const newTasks = tagData.tasks
	const tag = await TagModel.findById(tagID)
	console.log(tag.tasks)
	console.log(newTasks)
	tag.tasks.forEach(async taskID => {
		let isExist = false
		for( let i=0; i< newTasks.length; i++ )
			if(taskID == newTasks[i]) {
				isExist = true
				break
			}
		if(isExist)
			existTask.push(taskID)
		else
			await removeTagFromTask(taskID, tagID)
	})
	newTasks.forEach(async taskID => {
		let isExist = false
		for(let i=0; i<existTask.length; i++)
			if(taskID == existTask[i]) {
				isExist = true
				break
			}
		if(!isExist)
			await addTagToTask(taskID, tagID)
	})
	await TagModel.findByIdAndUpdate(tagID, tagData)
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
