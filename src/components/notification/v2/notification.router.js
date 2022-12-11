import {
	socketGetNotificationsOfUser,
	socketSetReadNotification,
} from './notification.controller'

export default function setupNotificationSocketListener(socket, user) {
	socket.join(`notification:${user._id}`)
	socketGetNotificationsOfUser(user)

	socket.on('get-notification', () => socketGetNotificationsOfUser(user))
	socket.on('read-notification', ({ notificationIDs }) =>
		socketSetReadNotification(user, notificationIDs),
	)
}
