import { makeObservable, observable, action } from 'mobx';
import { request } from '_utils/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import analytics from '@react-native-firebase/analytics'

export default class AuthStore {

    userLoaded = false;
    user = {
        id: null,
        address: null,
        birthdate: null,
        email_address: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        status: {},
    };
    notificationsCount = 0;

    getUser = () => {
        request('/user/profile.json', {
            method: 'GET',
            success: (response) => {
                this.setUser(response.user)
            },
            error: (error) => {
                this.setUser(null)
            },
        });
    };

    setUser = (user) => {
        if (user) {
            this.user.id = user.id;
            this.user.first_name = user.first_name;
            this.user.last_name = user.last_name;
            this.user.email_address = user.email_address;
            this.user.phone_number = user.phone_number;
            this.user.address = user.address;
            this.user.status = user.status;
            this.user.birthdate = user.birthdate;

            // analytics().setUserId((user.id).toString());
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
        AsyncStorage.removeItem('session_key');
    }

    setNotificationsCount = (total) => {
        this.notificationsCount = total;
    }

    constructor() {
        makeObservable(this, {
            userLoaded: observable,
            user: observable,
            notificationsCount: observable,
            setUser: action,
            getUser: action,
            logout: action,
            setNotificationsCount: action,
        })
    }
}
