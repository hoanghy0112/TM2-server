import { createNewTag } from './tag.model'

export async function httpCreateNewTag(req, res) {
	const tagData = req.body

	if (!req.user) {
		return res.status(401).send('Unauthorized')
	}

	try {
		const newTag = await createNewTag(tagData)
		return res.status(201).json(newTag)
	} catch (error) {
		return res.status(400).send(error)
	}
}
