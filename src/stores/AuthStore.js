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
    userValidated = false;
    notificationsCount = 0;

    // checkValidation = () => {

    //     request('/user/isValidated.json', {
    //         method: 'GET',
    //         withToken: true,
    //         data: {},
    //         success: (response) => {
    //             this.setUserValidated(response.isValidated);
    //         },
    //         error: (error) => {
    //             // Todo Ask API Explanations
    //             this.setUserValidated(false);
    //         }
    //     })
    // }

    getUser = () => {
        request('/user/profile.json', {
            method: 'GET',
            success: (response) => {
                this.setUser(response)
                this.setUserValidated(response.is_verified.status);
            },
            error: (error) => {
                this.setUser(null)
            },
        });
    };

    setUser = (response) => {
        if (response?.user) {
            const {user} = response;
            this.user.id = user.id;
            this.user.first_name = user.first_name;
            this.user.last_name = user.last_name;
            this.user.email_address = user.email_address;
            this.user.phone_number = user.phone_number;
            this.user.address = user.address;
            this.user.status = user.status;
            this.user.birthdate = user.birthdate;
            this.user.contact_consent = response.contact_consent
            this.user.online_order_token = response.online_order_token

            // analytics().setUserId((user.id).toString());
        }

        this.userLoaded = true
    }

    setUserValidated = (response) => {
        this.userValidated = response;
    }

    logout = async () => {
        this.user = {
            id: null,
            name: '',
            email: '',
            phone: '',
        }
        this.userValidated = false;
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
            userValidated: observable,
            setUserValidated: action,
        })
    }
}
