import io from '../../../../bin/socketServer'
import {
	createNewNotification,
	getAllNotificationsOfUser,
	setReadNotifications,
} from '../notification.model'

export async function addNewNotification(notification) {
	const { userIDs } = notification

	try {
		createNewNotification(notification)

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
	if (!notificationIDs) return res.status(400).send('Bad request')

	try {
		await setReadNotifications(notificationIDs)
		const notifications = await getAllNotificationsOfUser(userID)
		io.to(`notification:${user._id}`).emit('notification', notifications)
	} catch (error) {
		io.to(`notification:${user._id}`).emit('error-notification', error)
	}
}
