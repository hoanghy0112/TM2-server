import { getAllGrTasksOfUser } from '../../groupTask/groupTask.model'

export default async function setupGroupSocketListener(socket, user) {
	const groupIDs = (await getAllGrTasksOfUser(user._id)).map(
		(group) => group._id,
	)
	groupIDs.forEach((groupID) => {
		socket.join(`group:${groupID}`)
	})

	socket.on('create-group', (groupID) => {
		socket.join(`group:${groupID}`)
	})
}
