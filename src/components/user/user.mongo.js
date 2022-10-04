import mongoose from 'mongoose'

const UserModel = mongoose.Schema({
	userID: {
		type: String,
		require: true,
	},
	givenName: {
		type: String,
		require: true,
	},
	familyName: {
		type: String,
		require: true,
	},
	photo: {
		type: String,
		require: false,
	},
	email: {
		type: String,
		require: false,
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
