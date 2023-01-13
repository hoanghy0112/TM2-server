import mongoose from 'mongoose'
import UserModel from '../user/user.mongo'
import TagModel from '../tag/tag.mongo'
import GroupModel from '../group/group.mongo'

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
	const { operationType } = data
	console.log(data)

	if (operationType === 'insert') {
		// add new task to user
		const newTask = data.fullDocument

		await Promise.all(
			newTask.participants.map(async (userID) => {
				await UserModel.findByIdAndUpdate(userID, {
					$push: {
						tasks: newTask._id,
					},
				})
			}),
		)

		// add task to tags
		newTask.tags.forEach(async (tagID) => {
			await TagModel.findByIdAndUpdate(tagID, {
				$push: {
					tasks: newTask._id,
				},
			})
		})

		if (newTask?.belongTo) {
			GroupModel.findByIdAndUpdate(newTask.belongTo, {
				$addToSet: {
					tasks: newTask._id,
				},
			})
		}
	} else if (operationType === 'delete') {
		const { _id } = data.documentKey

		const task = await (
			await TaskModel.findById(_id)
		).populate('tags participants')

		// remove task from user
		task.participants.forEach(async (userID) => {
			await UserModel.findByIdAndUpdate(userID, {
				$pull: {
					tasks: task._id,
				},
			})
		})

		// remove task from tags
		task.tags.forEach(async (tagID) => {
			await TagModel.findByIdAndUpdate(tagID, {
				$pull: {
					tasks: task._id,
				},
			})
		})
	}
})

export default TaskModel
