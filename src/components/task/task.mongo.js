import mongoose from 'mongoose'
import UserModel from '../user/user.mongo'
import TagModel from '../tag/tag.mongo'
import GroupModel from '../group/group.mongo'
import {
	addNewTaskToGroup,
	addNewTaskToTag,
	addNewTaskToUser,
	deleteTaskFromGroup,
	deleteTaskFromTag,
	deleteTaskFromUser,
} from './task.helper'

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
		const newTask = data.fullDocument

		addNewTaskToUser(newTask, newTask.participants)
		addNewTaskToTag(newTask, newTask.tags)
		if (newTask?.belongTo) addNewTaskToGroup(newTask, newTask.belongTo)
	} else if (operationType === 'delete') {
		const { _id } = data.documentKey

		const task = await TaskModel.findById(_id)

		deleteTaskFromUser(task._id, task.participants)
		deleteTaskFromTag(task._id, task.tags)
		if (task?.belongTo) deleteTaskFromGroup(task._id, task.belongTo)
	} else {
	}
})

export default TaskModel
