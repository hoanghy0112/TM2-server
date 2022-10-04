import TagModel from './tag.mongo'

export async function createNewTag(tag) {
	return await TagModel.create(tag)
}

export async function addNewTagToTask(tag, task) {
	return await TagModel.findOneAndUpdate(
		{
			_id: tag._id,
		},
		{
			$push: { tasks: task },
		},
	)
}
