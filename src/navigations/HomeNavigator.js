import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '_scenes/HomeScreen'
import NotificationsScreen from '_scenes/NotificationsScreen'
import { StyleSheet } from 'react-native'
import * as Colors from '_styles/colors'

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.GRAY_MEDIUM
    }
})

function HomeNavigator () {
    return (
      <Stack.Navigator initialRouteName="Home.Dashboard" screenOptions={{
          headerShown: false,
      }}>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Home.Dashboard" component={HomeScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Notifications" component={NotificationsScreen}/>
      </Stack.Navigator>
    )
}

export default HomeNavigator
