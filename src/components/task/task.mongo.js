import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
	title: { type: String, required: true, default: 'Untitled' },
	location: { type: String, required: false },
	priority: { type: Number, required: true, default: 3 },
	time: {
		from: { type: Date, required: true },
		to: { type: Date, required: true },
	},
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
	descriptions: [String],
	days: [Date]
})

const TaskModel = mongoose.model('Task', TaskSchema)
export default TaskModel