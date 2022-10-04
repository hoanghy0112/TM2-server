import { createNewTag } from './tag.model'

export async function httpCreateNewTag(req, res) {
	try {
		const newTag = await createNewTag(tagData)
		return res.status(201).json(newTag)
	} catch (error) {
		return res.status(400).send(error)
	}
}
export async function httpGetAllTag(req, res) {
}