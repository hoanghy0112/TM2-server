import UserModel from './user.mongo'

export async function getUserInfo(userID) {
	return await UserModel.findOne({ userID })
}

export async function updateUserInfo(userInfo) {
	return await UserModel.findOneAndUpdate(
		{
			userID: userInfo.userID,
		},
		userInfo,
		{
			upsert: true,
		},
	)
}

export async function addNewTaskToUser(user, task) {
	return await UserModel.findOneAndUpdate(
		{
			_id: user._id,
		},
		{
			$push: { tasks: task },
		},
	)
}

export async function createUserInfo(userInfo) {
	return await UserModel.create(userInfo)
}
