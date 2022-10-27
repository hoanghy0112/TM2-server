import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: false },
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	groupTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groupTask' }],
})

const GroupModel = mongoose.model('Group', GroupSchema)

export default GroupModel
