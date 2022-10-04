import { createNewGroup } from "./group.model"

export async function httpCreateNewGroup(req, res) {
	const groupData = req.body

	try {
		const newGroup = await createNewGroup(groupData)
		return res.status(201).json(newGroup)
	} catch (error) {
		return res.status(400).send(error)
	}
}
