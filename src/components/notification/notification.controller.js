import {
    getAllNotificationsOfUser,
    setReadNotifications
} from './notification.model'

import NotificationModel from './notification.mongo'

export async function httpGetNotificationsOfUser(req, res) {
    const userID = req.user._id
    if (!userID)
        return res.status(400).send('Bad request')
    try {
        return res.status(200).send(await getAllNotificationsOfUser(userID))
    } catch (error) {
        return res.status(500).send('Server error: ' + error.message)
    }
}

export async function httpSetReadNotification(req, res) {
    const notificationsID = req.body.notificationsID
    if (!notificationsID)
        return res.status(400).send('Bad request')
    try {
        await setReadNotifications(notificationsID)
        return res.status(200).send("Ok")
    } catch (error) {
        return res.status(500).send('Server error: ' + error.message)
    }
}