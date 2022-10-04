import mongoose from 'mongoose'

const UserModel = new mongoose.Schema({
	givenName: {
		type: String,
		required: true,
	},
	familyName: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: false,
	},
	friends: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	tasks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Task',
		},
	],
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tag',
		},
	],
	groups: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
		},
	],
})

export default mongoose.model('User', UserModel)
