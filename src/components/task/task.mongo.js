import mongoose from 'mongoose'
import UserModel from '../user/user.mongo'
import TagModel from '../tag/tag.mongo'

const TaskSchema = new mongoose.Schema({
	title: { type: String, required: true, default: 'Untitled' },
	location: { type: String, required: false },
	priority: { type: Number, required: true, default: 3 },
	time: {
		from: { type: Date, required: true },
		to: { type: Date, required: true },
	},
	descriptions: [String],
	days: [Date],
	type: {
		type: String,
		enum: ['user', 'group'],
		default: 'user',
	},
	belongTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: false,
	},
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
	participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

const TaskModel = mongoose.model('Task', TaskSchema)

TaskModel.watch().on('change', async (data) => {
	console.log({ data })

	// add new task to user
	// await Promise.all(
	// 	userIDs.map(async (userID) => {
	// 		await UserModel.findByIdAndUpdate(userID, {
	// 			$push: {
	// 				tasks: newTask._id,
	// 			},
	// 		})
	// 	}),
	// )

	// add task to tags
	// newTask.tags.forEach(async (tagID) => {
	// 	await TagModel.findByIdAndUpdate(tagID, {
	// 		$push: {
	// 			tasks: newTask._id,
	// 		},
	// 	})
	// })
})

export default TaskModel
