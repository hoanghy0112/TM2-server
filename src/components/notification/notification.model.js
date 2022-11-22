import NotificationModel from './notification.mongo'
import UserModel from '../user/user.mongo'
import GroupModel from '../group/group.mongo'
import GroupTaskModel from '../groupTask/groupTask.mongo'


export async function createNotificationForCreateAndUpdateTask(userID, groupID, notiContent) {
    const user = await UserModel.findById(userID)
    const group = await GroupModel.findById(groupID)
    group.users.forEach(async id => {
        if (id != userID) {
            const notification = await NotificationModel.create({
                content: user.givenName + " " + notiContent,
                thumbnail: user.photo,
                belongTo: id,
                time: new Date(),
                isRead: false,
                url: ""
            })
            await UserModel.findByIdAndUpdate(id, {
                $push: {
                    notifications: notification._id
                }
            })
        }
    })
}

export async function createNotificationForJoinAndQuitTask(userID, taskID, flag) {
    const task = await GroupTaskModel.findById(taskID)
    const user = await UserModel.findById(userID)
    task.participants.forEach(async id => {
        if (id != userID) {
            const notification = await NotificationModel.create({
                content: user.givenName + (flag ? " vừa tham gia task: " : " vừa rời khỏi task: ") + task.title,
                thumbnail: user.photo,
                belongTo: id,
                time: new Date(),
                isRead: false,
                url: ""
            })
            await UserModel.findByIdAndUpdate(id, {
                $push: {
                    notifications: notification._id
                }
            })
        }
    })
}

export async function createNotificationForJoinAndOutGroup(userID, groupID, flag) {
    const group = await GroupModel.findById(groupID)
    const user = await UserModel.findById(userID)
    group.users.forEach(async id => {
        if (id != group.admin) {
            const notification = await NotificationModel.create({
                content: user.givenName + " " + (flag ? " được thêm vào group " : " bị xóa khỏi group ") + group.name,
                thumbnail: user.photo,
                belongTo: id,
                time: new Date(),
                isRead: false,
                url: ""
            })
            await UserModel.findByIdAndUpdate(id, {
                $push: {
                    notifications: notification._id
                }
            })
        }
    })
}

export async function getAllNotificationsOfUser(userID) {
    return await NotificationModel.find({ belongTo: userID })
}

export async function setReadNotifications(notificationID) {
    notificationID.forEach(async id => await NotificationModel.findByIdAndUpdate(id, {
        isRead: true
    }))
}