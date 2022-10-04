import TagModel from './tag.mongo'

export async function createNewTag(tag) {
	return await TagModel.create(tag)
}
