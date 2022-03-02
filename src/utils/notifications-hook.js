import * as React from 'react';
import { useEffect } from "react";
import { logToConsole, addEventListener, removeEventListener, requestPermissions } from "react-native-related-digital";
import { euroMessageApi, visilabsApi } from "_utils/analytics";

const useNotifications = (id) => {
    useEffect(() => {
        requestPermissions(false).then(() => {
        logToConsole(true)
            addExtra()
            addListeners()
        })

        return () => removeListeners()
    }, [])

    const addListeners = () => {
        addEventListener('register', async (token) => {
            setToken(token);
            addExtra().then((res) => euroMessageApi.subscribe(token));
            visilabsApi.register(token, (result) => {
                console.log('visilabsApi result', result)
            })
        }, (notificationPayload) => {
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
        await euroMessageApi.setUserProperty("pushPermit","Y");  // Y= active, N=passive
        await euroMessageApi.setUserProperty("gsmPermit","Y");   // Y= active, N=passive
        await euroMessageApi.setUserProperty("emailPermit","Y"); // Y= active, N=passive
        await euroMessageApi.setUserProperty('Email', id)
        await euroMessageApi.setUserProperty('user_id', id)
    }
}

export default useNotifications;
