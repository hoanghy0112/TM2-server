import mongoose from 'mongoose'

const UserModel = new mongoose.Schema(
	{
		userID: {
			type: String,
			required: true,
			unique: true,
		},
		givenName: {
			type: String,
			required: true,
		},
		familyName: {
			type: String,
			required: true,
		},
		engName: {
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
		groupTasks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'groupTask',
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
	},
	{
		virtuals: {
			name: {
				get() {
					return removeVietnameseTones(
						`${this.familyName} ${this.givenName}`,
					)
				},
			},
		},
	},
)

export default mongoose.model('User', UserModel)
