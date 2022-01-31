import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '_scenes/HomeScreen'
import { useEffect } from "react";
import messaging from '@react-native-firebase/messaging'
import { isIphone } from "_utils/helpers";
import notifee from '@notifee/react-native';

const Stack = createStackNavigator()
function HomeNavigator () {

    useEffect(() => {
        // if(isIphone()) return;
        messaging().getToken().then((fcm) => console.log('fcm', fcm))
    },[])

    useEffect(() => {
        // if(isIphone()) return;
        messaging().getInitialNotification().then((notification) => {
            // Todo navigate to a screen if needed
        })
    },[])

    useEffect(() => {
        // if(isIphone()) return;
        messaging().onMessage(async (notification) => {
            // Display a notification
            try{
                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                });
                await notifee.displayNotification({
                    title: notification.notification.title,
                    body: notification.notification.body,
                    android: {
                        channelId,
                    },
                })
            } catch (e){
                console.log('error',e);
            }
        })
    })

    return (
      <Stack.Navigator initialRouteName="Home.Dashboard">
          <Stack.Screen name="Home.Dashboard" component={HomeScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    )
}

export default HomeNavigator
