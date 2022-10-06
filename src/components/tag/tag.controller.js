import { addNewTagToUser } from '../user/user.model'
import { createNewTag, getTagByTitle, getAllTagsOfUser } from './tag.model'

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

export async function httpGetTagByID(req, res) {
	const title = req.params.title

	if (!title) return res.status(400).send('Bad request')

	const tag = await getTagByTitle(title)

	return res.status(200).json(tag)
}

export async function httpGetAllTags(req, res) {
	const userID = req.user._id

	return res.status(200).json(await getAllTagsOfUser(userID))
}
