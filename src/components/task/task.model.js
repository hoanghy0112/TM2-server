import TaskModel from './task.mongo'

export async function createNewTask(task) {
	const taskData = await TaskModel.create(task)

	return await taskData.populate('participants tags belongTo')
}
