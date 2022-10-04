import GroupModel from './group.mongo'

export async function createNewGroup(group) {
	return await GroupModel.create(group)
}
