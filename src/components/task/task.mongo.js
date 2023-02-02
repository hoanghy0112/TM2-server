import mongoose from 'mongoose'
import {
	addNewTaskToGroup,
	addNewTaskToUser,
	deleteTaskFromGroup,
	deleteTaskFromUser,
	updateParticipantsOfTask,
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
		if (newTask?.belongTo) await addNewTaskToGroup(newTask, newTask.belongTo)
	} else if (operationType === 'delete') {
		const { _id } = data.documentKey

		deleteTaskFromUser(_id)
		deleteTaskFromGroup(_id)
	} else {
		const { _id } = data.documentKey
		const { updatedFields } = data.updateDescription

		const { participants } = updatedFields

		if (participants) updateParticipantsOfTask(_id, participants)
	}
})

export default TaskModel
