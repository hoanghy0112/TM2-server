import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
	title: { type: String, required: true },
	location: { type: String, required: false },
	time: {
		from: { type: Date, required: true },
		to: { type: Date, required: true },
	},
	participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
	belongTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
	},
	descriptions: [String],
})

const TaskModel = mongoose.model('Task', TaskSchema)
export default TaskModel
