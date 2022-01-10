import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '_scenes/HomeScreen'
import NotificationsScreen from '_scenes/NotificationsScreen'
import { StyleSheet } from 'react-native'
import * as Colors from '_styles/colors'
import Logo from '_assets/images/logo_small_primary.svg'
import InfoIcon from '_assets/images/info.svg'
import NotificationIcon from '_assets/images/bell.svg'
import HeaderTouchable from '_atoms/HeaderTouchable';
import { scaleSize } from '_styles/mixins';

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.WHITE
    }
})

function HomeNavigator () {
    return (
      <Stack.Navigator initialRouteName="Home.Dashboard">
          <Stack.Screen name="Home.Dashboard" component={HomeScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    )
}

export default HomeNavigator
