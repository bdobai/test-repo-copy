import { makeObservable, observable, action } from 'mobx';

export default class NotificationsStore {
    notifications = []

    addNotification = (alert) => {
        return;
        if(this.notifications.some((item) => {
            return item.description === alert.description;
        })) {
            return;
        }
        alert.id = Math.floor((Math.random() * 1000000) + 1);
        this.notifications.push(alert);
    };

    removeNotification = (notification) => {
        let filteredNotifications = this.notifications.filter((item) => item.id !== notification.id);
        this.notifications.replace(filteredNotifications);
    }

    constructor() {
        makeObservable(this, {
            notifications: observable,
            addNotification: action,
            removeNotification: action,
        })
    }
}
