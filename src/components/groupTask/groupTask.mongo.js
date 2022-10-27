import mongoose from 'mongoose'

const GroupTaskSchema = new mongoose.Schema({
	title: { type: String, required: true, default: 'Untitled' },
	location: { type: String, required: false },
	priority: { type: Number, required: true, default: 3 },
	time: {
		from: { type: Date, required: true },
		to: { type: Date, required: true },
	},
	participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	belongTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: true
	},
	descriptions: [String],
})

const GroupTaskModel = mongoose.model('groupTask', GroupTaskSchema)
export default GroupTaskModel