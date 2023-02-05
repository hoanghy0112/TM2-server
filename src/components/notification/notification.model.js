import NotificationModel from './notification.mongo'
import UserModel from '../user/user.mongo'
import GroupModel from '../group/group.mongo'
import GroupTaskModel from '../groupTask/groupTask.mongo'
import io from '../../../bin/socketServer'

export async function createNotificationForCreateAndUpdateTask(
	userID,
	groupID,
	notiContent,
) {
	const user = await UserModel.findById(userID)
	const group = await GroupModel.findById(groupID)
	group.users.forEach(async (id) => {
		if (id != userID) {
			const notification = await NotificationModel.create({
				content: user.displayName + ' ' + notiContent,
				thumbnail: user.photo,
				belongTo: id,
				time: new Date(),
				isRead: false,
				url: '',
			})
			await UserModel.findByIdAndUpdate(id, {
				$push: {
					notifications: notification._id,
				},
			})
		}
	})
}

export async function createNotificationForJoinAndQuitTask(
	userID,
	taskID,
	isJoin,
) {
	const task = await GroupTaskModel.findById(taskID)
	const user = await UserModel.findById(userID)
	task.participants.forEach(async (id) => {
		if (id != userID) {
			const notification = await createNewNotification({
				content: `${user.displayName} ${
					isJoin ? 'vừa tham gia task' : 'vừa rời khỏi task'
				}: ${task.title}`,
				thumbnail: user.photo,
				belongTo: id,
				time: new Date(),
			})
			await UserModel.findByIdAndUpdate(id, {
				$push: {
					notifications: notification._id,
				},
			})
		}
	})
}

export async function createNotificationForInviteToGroup(userID, groupID) {
	const group = await GroupModel.findById(groupID)
	const user = await UserModel.findById(userID)
	const admin = await UserModel.findById(String(group.admin))

	const notification = await createNewNotification({
		content: `${admin.familyName} ${admin.givenName} đã mời bạn tham gia nhóm ${group.name}`,
		thumbnail: admin.photo,
		belongTo: userID,
		time: new Date(),
		groupID,
		type: 'invite',
	})

	notifyUser(userID, notification)

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			notifications: notification._id,
		},
	})
}

export async function createNotificationForRemoveFromGroup(userID, groupID) {
	const group = await GroupModel.findById(groupID)
	const admin = await UserModel.findById(String(group.admin))

	const notification = await createNewNotification({
		content: `${admin.familyName} ${admin.givenName} đã đưa bạn ra khỏi nhóm ${group.name}`,
		thumbnail: admin.photo,
		belongTo: userID,
		time: new Date(),
		groupID,
		type: 'group-remove-user',
	})

	notifyUser(userID, notification)

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			notifications: notification._id,
		},
	})
}

export async function createNotificationForJoinGroup(userID, groupID) {
	const group = await GroupModel.findById(groupID)
	const user = await UserModel.findById(userID)

	const notification = await createNewNotification({
		content: `Bạn vừa được thêm vào nhóm ${group.name}`,
		thumbnail: user.photo,
		belongTo: userID,
		time: new Date(),
		groupID,
		type: 'join-group',
	})

	notifyUser(userID, notification)

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			notifications: notification._id,
		},
	})
}

export async function createNotificationForJoinAndOutGroup(
	userID,
	groupID,
	isJoin,
) {
	const group = await GroupModel.findById(groupID)
	const user = await UserModel.findById(userID)
	group.users.forEach(async (id) => {
		if (id != group.admin) {
			const notification = await createNewNotification({
				content: `${user.displayName} ${
					isJoin ? 'vừa tham gia group' : 'vừa rời khỏi group'
				}: ${task.title}`,
				thumbnail: user.photo,
				belongTo: id,
				time: new Date(),
				groupID,
				type: 'notification',
			})
			await UserModel.findByIdAndUpdate(id, {
				$push: {
					notifications: notification._id,
				},
			})
		}
	})
}

export async function createNotificationForInviteToTask(taskID, userID) {
	const user = await UserModel.findById(userID)

	const notification = await createNewNotification({
		content: `Bạn vừa được thêm vào một task mới`,
		thumbnail: user.photo,
		belongTo: userID,
		time: new Date(),
		taskID,
		type: 'invite-task',
	})

	notifyUser(userID, notification)

	await UserModel.findByIdAndUpdate(userID, {
		$push: {
			notifications: notification._id,
		},
	})
}

export async function getAllNotificationsOfUser(userID) {
	return await NotificationModel.find({ belongTo: userID }).sort({ time: -1 })
}

export async function setReadNotifications(notificationID) {
	notificationID.forEach(
		async (id) =>
			await NotificationModel.findByIdAndUpdate(id, {
				isRead: true,
			}),
	)
}

export async function createNewNotification({
	content,
	thumbnail,
	belongTo,
	userIDs,
	groupID,
	time,
	url = '',
	taskID,
	type,
}) {
	return await NotificationModel.create({
		content,
		thumbnail,
		belongTo,
		userIDs,
		groupID,
		isRead: false,
		taskID,
		time,
		url,
		type,
	})
}

async function notifyUser(userID, notification) {
	const notifications = await getAllNotificationsOfUser(userID)

	io.to(`notification:${userID}`).emit('notification', notifications)
	io.to(`notification:${userID}`).emit('new-notification', notification)
}
