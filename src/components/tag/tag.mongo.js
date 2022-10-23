import mongoose from 'mongoose'

const TagSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	description: { type: String, required: false },
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
	color: {
		type: String,
		default: '#00a6c',
	},
})

const TagModel = mongoose.model('Tag', TagSchema)

export default TagModel
