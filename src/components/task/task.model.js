import TaskModel from './task.mongo'

export async function createNewTask(task) {
	return await TaskModel.create(task)
}
