import mongoose from 'mongoose'

const GroupSchema = mongoose.Schema({
	name: String,
	description: String,
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
})

const GroupModel = mongoose.model('Group', GroupSchema)

export default GroupModel
