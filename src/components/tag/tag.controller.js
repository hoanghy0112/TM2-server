import { addNewTagToUser } from '../user/user.model'
import { createNewTag, getTagByTitle, getAllTagsOfUser } from './tag.model'
import TagModel from './tag.mongo'

export async function httpCreateNewTag(req, res) {
	const tagData = req.body

	try {
		const newTag = await createNewTag(tagData)

		await addNewTagToUser(req.user, newTag)

		return res.status(201).json(newTag)
	} catch (error) {
		if (error.code == 11000) {
			return res.status(409).send(`${tagData.title} tag is already existed`)
		}

		return res.status(400).send(error)
	}
}

export async function httpGetTagByTitle(req, res) {
	const title = req.params.title

	const userID = req.user._id

	if (!title) return res.status(400).send('Bad request')
	try {
		return res.status(200).json(await getTagByTitle(userID, title))
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpGetAllTags(req, res) {
	const userID = req.user._id

	return res.status(200).json(await getAllTagsOfUser(userID))
}

export async function httpUpdateTag(req, res) {
	const tagID = req.body.tagID
	const tagData = req.body.tagData
	console.log(tagID, tagData)
	try {
		await TagModel.findByIdAndUpdate(124, tagData)
		return res.status(200).send('Update successfully')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}
