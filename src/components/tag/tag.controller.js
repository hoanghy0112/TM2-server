import {
	createNewTag,
	getTagByTitle,
	getAllTagsOfUser,
	removeTag,
	addNewTagToUser,
} from './tag.model'
import TagModel from './tag.mongo'

export async function httpCreateNewTag(req, res) {
	const tagData = req.body
	const userID = req.user._id

	try {
		const newTag = await createNewTag(tagData)

		await addNewTagToUser(userID, newTag)

		return res.status(201).json(newTag)
	} catch (error) {
		if (error.code == 11000) {
			return res.status(409).send(`${tagData.title} tag has already existed`)
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

	try {
		const allTags = await getAllTagsOfUser(userID)

		return res.status(200).json(allTags)
	} catch (error) {
		return res.status(500).send(error)
	}
}

export async function httpUpdateTag(req, res) {
	const tagID = req.body.tagID
	const tagData = req.body.tagData
	console.log(tagID, tagData)
	try {
		await TagModel.findBtyIdAndUpdate(tagID, tagData)
		return res.status(200).send('Update successfully')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpRemoveTag(req, res) {
	const userID = req.user._id
	const tagID = req.body.tagID
	if (!userID || !tagID) return res.status(400).send('Bad request')
	try {
		if (await removeTag(userID, tagID))
			return res.status(200).send('Remove  successfully')
		else return res.status(400).send('Bad request')
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}
