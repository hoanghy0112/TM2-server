import {
	createNewTag,
	getTagByTitle,
	getAllTagsOfUser,
	removeTag,
	addNewTagToUser,
	updateTagByID,
	getTagByID,
} from './tag.model'

export async function httpCreateNewTag(req, res) {
	const tagData = req.body
	const userID = req.user._id

	try {
		const newTag = await createNewTag(tagData)

		await addNewTagToUser(userID, newTag)

		return res.status(201).json(newTag)
	} catch (error) {
		console.log({ error })
		if (error.code == 11000) {
			return res.status(409).send(`${tagData.title} tag has already existed`)
		}

		return res.status(400).send(error)
	}
}

export async function httpGetTagByTitle(req, res) {
	const title = req.query.title

	const userID = req.user._id

	if (!title) return res.status(400).send('Bad request')

	try {
		return res.status(200).json(await getTagByTitle(userID, title))
	} catch (error) {
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpGetTagByID(req, res) {
	const userID = req.user._id
	const tagID = req.params.tagID

	try {
		return res.status(200).json(await getTagByID(userID, tagID))
	} catch (error) {
		if (error.code === 403) return res.status(403).send('Forbidden')
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
	const userID = req.user._id
	const tagID = req.params.tagID
	const tagData = req.body

	try {
		await updateTagByID(userID, tagID, tagData)
		return res.status(202).send('Update successfully')
	} catch (error) {
		if (error.code === 403) return res.status(403).send('Forbidden')
		return res.status(500).send('Server error: ' + error.message)
	}
}

export async function httpRemoveTag(req, res) {
	const userID = req.user._id
	const tagID = req.params.tagID

	try {
		await removeTag(userID, tagID)
		return res.status(200).send('Remove successfully')
	} catch (error) {
		if (error.code == 403) return res.status(403).send('Forbidden')
		return res.status(500).send(error)
	}
}
