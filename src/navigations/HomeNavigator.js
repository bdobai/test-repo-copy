import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '_scenes/HomeScreen'
import { StyleSheet } from 'react-native'
import * as Colors from '_styles/colors'
import { useEffect } from "react";
import messaging from '@react-native-firebase/messaging'
import { isIphone } from "_utils/helpers";
import notifee from '@notifee/react-native';

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.WHITE
    }
})

function HomeNavigator () {

    useEffect(() => {
        if(isIphone()) return;
        messaging().getToken().then((fcm) => console.log('fcm', fcm))
    },[])

    useEffect(() => {
        if(isIphone()) return;
        messaging().getInitialNotification().then((notification) => {
            console.log('notification', notification);
        })
    },[])

    useEffect(() => {
        if(isIphone()) return;
        messaging().onMessage(async (notification) => {
            // Display a notification
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });
            await notifee.displayNotification({
                title: notification.notification.title,
                body: notification.notification.body,
                android: {
                    channelId,
                    smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                },
            })
        })
    })

    return (
      <Stack.Navigator initialRouteName="Home.Dashboard">
          <Stack.Screen name="Home.Dashboard" component={HomeScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    )
}

export default HomeNavigator
