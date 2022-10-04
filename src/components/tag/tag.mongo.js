import mongoose from 'mongoose'

const TagSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: false },
})

const TagModel = mongoose.model('Tag', TagSchema)

export default TagModel
