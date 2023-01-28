import mongoose from 'mongoose'

const TagSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: false },
	description: { type: String, required: false },
	// tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
	color: {
		type: String,
		default: '#00a6ca',
	},
})

const TagModel = mongoose.model('Tag', TagSchema)

export default TagModel
