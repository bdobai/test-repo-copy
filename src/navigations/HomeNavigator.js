import * as React from 'react'
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack'
import HomeScreen from '_scenes/HomeScreen'
import { useEffect } from "react";
import messaging from '@react-native-firebase/messaging'
import { isIphone } from "_utils/helpers";
import notifee from '@notifee/react-native';
import GiftCardBalanceScreen from "_scenes/account/GiftCardBalanceScreen";
import HomeHeaderTitle from "_atoms/HomeHeaderTitle";
import LeftChevron from "_assets/images/left-chevron.svg";
import {scaleSize} from "_styles/mixins";
import {navigationStyles} from "_styles/navigation";

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
      <Stack.Navigator initialRouteName="Home.Dashboard" screenOptions={{
          headerMode: 'float',
          headerBackImage: () => <LeftChevron fill={'#ffffff'} height={scaleSize(18)} width={scaleSize(52)}/>,
          headerBackTitleVisible: false,
          headerTitleStyle: navigationStyles.accountHeader,
          headerStyle: navigationStyles.primaryHeader,
          headerBackTitleStyle: navigationStyles.headerBackTitleStyle,
          cardStyle: navigationStyles.cardStyle,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitleAlign: 'center',
      }}>
          <Stack.Screen name="Home.Dashboard" component={HomeScreen} options={({navigation}) => ({
              header: () => <HomeHeaderTitle onInbox={() => navigation.navigate('Modal', {screen: 'Messages'})}/>
          })}/>
          <Stack.Screen name="Gift Cards" component={GiftCardBalanceScreen}/>
      </Stack.Navigator>
    )
}

export default HomeNavigator
