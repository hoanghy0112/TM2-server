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
                content: user.engName + " " + notiContent,
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
                content: user.engName + (flag ? " vừa tham gia task: " : " vừa rời khỏi task: ") + task.title,
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
                content: user.engName + " " + (flag ? " được thêm vào group " : " bị xóa khỏi group ") + group.name,
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
    notificationID.forEach(id => NotificationModel.findByIdAndUpdate(id, {
        isRead: true
    }))
}