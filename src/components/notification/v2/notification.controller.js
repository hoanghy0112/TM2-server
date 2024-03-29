import io from '../../../../bin/socketServer'
import {
	createNewNotification,
	getAllNotificationsOfUser,
	setReadNotifications,
} from '../notification.model'

export async function addNewNotification(notification) {
	const { userIDs } = notification

	try {
		await createNewNotification(notification)

		userIDs.forEach((userID) => {
			io.to(`notification:${userID}`).emit('new-notification', notification)
		})
	} catch (error) {
		io.to(`notification:${user._id}`).emit('error-notification', error)
	}
}

export async function socketGetNotificationsOfUser(user) {
	const userID = user._id

	try {
		const notifications = await getAllNotificationsOfUser(userID)

		io.to(`notification:${userID}`).emit('notification', notifications)
	} catch (error) {
		io.to(`notification:${user._id}`).emit('error-notification', error)
	}
}

export async function socketSetReadNotification(user, notificationIDs) {
	if (!notificationIDs)
		io.to(`notification:${user._id}`).emit('error-notification', error)

	try {
		await setReadNotifications(notificationIDs)
		const notifications = await getAllNotificationsOfUser(user._id)
		io.to(`notification:${user._id}`).emit('notification', notifications)
	} catch (error) {
		io.to(`notification:${user._id}`).emit('error-notification', error)
	}
}
