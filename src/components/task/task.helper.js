export function addNewTaskToUser(newTask, userIDs) {
	userIDs.forEach(async (userID) => {
		await UserModel.findByIdAndUpdate(userID, {
			$addToSet: {
				tasks: newTask._id,
			},
		})
	})
}

export function addNewTaskToTag(newTask, tagIDs) {
	tagIDs.forEach(async (tagID) => {
		await TagModel.findByIdAndUpdate(tagID, {
			$addToSet: {
				tasks: newTask._id,
			},
		})
	})
}

export function addNewTaskToGroup(newTask, groupID) {
	GroupModel.findByIdAndUpdate(groupID, {
		$addToSet: {
			tasks: newTask._id,
		},
	})
}

export function deleteTaskFromUser(taskID, userIDs) {
	userIDs.forEach(async (userID) => {
		await UserModel.findByIdAndUpdate(userID, {
			$pull: {
				tasks: taskID,
			},
		})
	})
}

export function deleteTaskFromTag(taskID, tagIDs) {
	tagIDs.forEach(async (tagID) => {
		await TagModel.findByIdAndUpdate(tagID, {
			$pull: {
				tasks: taskID,
			},
		})
	})
}

export function deleteTaskFromGroup(taskID, groupID) {
	GroupModel.findByIdAndUpdate(groupID, {
		$pull: {
			tasks: taskID,
		},
	})
}

export function updateTask(taskID, updatedFields) {
   const fields = Array.from(Object.entries(updatedFields))

   const tagRegEx = /^tags.\d+$/
   
   // fields.forEach(([key, value]) => {
   //    if (tagRegEx.test(key))
   // })
}