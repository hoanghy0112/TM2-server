import mongoose from 'mongoose'

const TaskSchema = mongoose.Schema({
	location: String,
	time: {
		from: Date,
		to: Date,
	},
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tag',
		},
	],
	descriptions: [String],
})

const TaskModel = mongoose.model('Task', TaskSchema)
export default TaskModel
