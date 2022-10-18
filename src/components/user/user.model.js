import mongoose from 'mongoose'
import UserModel from './user.mongo'

export async function getUserInfo(userID) {
	return await UserModel.findOne({ userID: userID })
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

export async function addNewTagToUser(user, tag) {
	return await UserModel.findOneAndUpdate(
		{
			_id: user._id,
		},
		{
			$push: { tags: tag },
		},
	)
}

export async function createUserInfo(userInfo) {
	return await UserModel.create(userInfo)
}

export async function findUserByName(name) {
	return await UserModel.where('givenName')
}
