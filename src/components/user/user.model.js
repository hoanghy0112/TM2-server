import UserModel from './user.mongo'

export async function getUserInfo(userID) {
	const userInfo = await UserModel.findOne({ userID }).select(
		'_id userID givenName familyName email photo',
	)
	return userInfo
}

export async function getUserRequests(userID, pageIndex) {
	const userWithRequests = await UserModel.findOne(
		{ _id: userID },
		'requests',
		{
			limit: 10,
			skip: 10 * pageIndex,
		},
	).populate('requests')
	return userWithRequests.requests
}

export async function getUserInvitations(userID) {
	const userWithInvitations = await UserModel.findOne(
		{
			_id: userID,
		},
		'invitations',
		{
			limit: 10,
			skip: 10 * pageIndex,
		},
	).populate('invitations')
	return userWithInvitations.invitations
}

export async function updateUserInfo(userInfo) {
	return await UserModel.findOneAndUpdate(
		{
			_id: userInfo._id,
		},
		userInfo,
		{
			upsert: false,
			new: true,
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

export async function findUserByName(name) {
	const nameRegex = `${name}`
	return await UserModel.find({
		$or: [
			{ engName: new RegExp(nameRegex, 'i') },
			{ email: new RegExp(nameRegex, 'i') },
			{ givenName: new RegExp(nameRegex, 'i') },
			{ familyName: new RegExp(nameRegex, 'i') },
		],
	}).select('_id givenName familyName email photo')
}
