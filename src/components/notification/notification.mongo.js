import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    content: {type: String, required: true},
    thumbnail: {type: String, required: true},
    belongTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
    time: {type: Date, required: true},
    isRead: {type: Boolean, default: false},
    url: {type: String}
})

const NotificationModel = mongoose.model('Notification', NotificationSchema)
export  default NotificationModel