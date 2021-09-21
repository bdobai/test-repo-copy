import { makeObservable, observable, action } from 'mobx';
import { request } from '_utils/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info'
// import analytics from '@react-native-firebase/analytics'

export default class AuthStore {

    google = null;
    userLoaded = false;
    user = {
        id: null,
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        state_id: null,
        zip_code: '',
        image: null,
        goal: null
    };
    total_donated = 0;
    goalPercentage = 0;
    notificationsCount = 0;
    prevGoals = [];
    one_signal_user_id = null;
    device = null;

    getUser = () => {
        let deviceId = DeviceInfo.getDeviceId();

        request('/me', {
            method: 'GET',
            data: {
                device_id: deviceId,
            },
            success: (response) => {
                this.setUser(response)
                this.setNotificationsCount(response.notifications_count)
            },
            error: (error) => {
                this.setUser(null)
            },
        });
    };

    setUser = (user) => {
        if (user) {
            this.user.id = user.id;
            this.user.name = user.name;
            this.user.email = user.email;
            this.user.phone = user.phone;
            this.user.city = user.city;
            this.user.state = user.state;
            this.user.state_id = user.state_id;
            this.user.zip_code = user.zip_code;
            this.user.image = user.image;
            this.user.goal = user.goal;
            this.total_donated = user.total_donated;
            this.goalPercentage = user.goalPercentage;
            this.prevGoals = user.prev_goals;
            this.device = user.device;

            // analytics().setUserId((user.id).toString());
        }

        if(this.one_signal_user_id) {
            this.saveOneSignalUserId();
        }

        this.userLoaded = true
    }

    logout = async () => {
        this.user = {
            id: null,
            name: '',
            email: '',
            phone: '',
        }
        AsyncStorage.removeItem('JWTToken');
    }

    setGoal = (data) => {
        if (typeof data.goal !== 'undefined') {
            this.user.goal = data.goal
        }
        if (typeof data.goal !== 'undefined') {
            this.user.goal_until = data.goal_until
        }
        this.goalPercentage = this.user.goal && this.total_donated ? Math.floor(this.total_donated/this.user.goal * 100) : 0;
    }

    setTotalDonated = (total_donated) => {
        this.total_donated = total_donated;
        this.goalPercentage = this.user.goal && total_donated ? Math.floor(total_donated/this.user.goal * 100) : 0;
    }

    setOneSignalUserId = (one_signal_user_id) => {
        this.one_signal_user_id = one_signal_user_id;
        if(this.user.id) {
            this.saveOneSignalUserId();
        }
    }

    setNotificationsCount = (total) => {
        this.notificationsCount = total;
    }

    saveOneSignalUserId = () => {
        let deviceId = DeviceInfo.getDeviceId();
        if (!this.device || this.device.one_signal_id === this.one_signal_user_id) {
            return;
        }
        request('/set-one-signal-id', {
            data: {
                device_id: deviceId,
                one_signal_id: this.one_signal_user_id,
            },
            method: 'POST',
            success: (response) => {
                this.device = response.device
            },
            error: (error) => {

            },
        });
    }

    constructor() {
        makeObservable(this, {
            userLoaded: observable,
            user: observable,
            prevGoals: observable,
            goalPercentage: observable,
            total_donated: observable,
            one_signal_user_id: observable,
            notificationsCount: observable,
            device: observable,
            setUser: action,
            getUser: action,
            logout: action,
            setGoal: action,
            setOneSignalUserId: action,
            setNotificationsCount: action,
            setTotalDonated: action,
        })
    }
}
