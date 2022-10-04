import mongoose from 'mongoose'

const TagSchema = mongoose.Schema({
	title: String,
	description: String,
})

const TagModel = mongoose.model('Tag', TagSchema)

export default TagModel
