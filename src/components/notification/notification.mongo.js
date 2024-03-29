import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
	content: { type: String, required: true },
	thumbnail: { type: String, required: true },
	belongTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	userIDs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	taskID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task',
		required: false,
	},
	groupID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: false,
	},
	time: { type: Date, required: true, index: true },
	isRead: { type: Boolean, default: false },
	url: { type: String },
	type: String,
})

const NotificationModel = mongoose.model('Notification', NotificationSchema)
export default NotificationModel
