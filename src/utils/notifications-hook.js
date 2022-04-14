import * as React from 'react';
import { useEffect } from "react";
import {
    logToConsole,
    addEventListener,
    removeEventListener,
    requestPermissions,
    setApplicationIconBadgeNumber,
} from "react-native-related-digital";
import { euroMessageApi, visilabsApi } from "_utils/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useNotifications = (email, id, onNotification) => {
    useEffect(() => {
        setApplicationIconBadgeNumber(0)
    },[])

    useEffect(() => {
        AsyncStorage.getItem('firstTime').then((res) => {
            if(res){
                requestPermissions(false).then(() => logToConsole(true))
                addExtra()
                addListeners()
                return () => removeListeners()
            }
        })
        AsyncStorage.setItem('firstTime', 'true');
    }, [email, id])

    const addListeners = () => {
        addEventListener('register', async (token) => {
            addExtra().then((res) => {
                visilabsApi.register(token);
                euroMessageApi.subscribe(token)
            })
            visilabsApi.register(token, (result) => {
                console.log('visilabsApi result', result)
            })
        }, (notificationPayload) => {
            onNotification(notificationPayload?.url)
            console.log('notification payload', notificationPayload)
        }, euroMessageApi, visilabsApi)

        addEventListener('registrationError', async (registrationError) => {
            console.log('registrationError is ', registrationError)
        }, euroMessageApi)

        addEventListener('carouselItemClicked', async (carouselItemInfo) => {
            console.log('carouselItemInfo is ', carouselItemInfo)
        }, euroMessageApi)
    }

    const removeListeners = () => {
        removeEventListener('register')
        removeEventListener('registrationError')
        removeEventListener('carouselItemClicked')
    }

    const addExtra = async () => {
        return await euroMessageApi.setUserProperties({
            "pushPermit": "Y",
            "gsmPermit": "Y",
            "emailPermit": "Y",
            "Email": email,
            "Keyid": id,
        })
    }
}

export default useNotifications;
