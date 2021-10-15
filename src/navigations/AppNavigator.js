import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccountNavigator from '_navigations/AccountNavigator'
import AuthNavigator from '_navigations/AuthNavigator'
import HomeNavigator from '_navigations/HomeNavigator'
import HistoryScreen from '_scenes/HistoryScreen'
import { StyleSheet } from 'react-native'
import { Colors } from '_styles'
import OffersIcon from '_assets/images/offers.svg'
import OffersActiveIcon from '_assets/images/offers-active.svg'
import HistoryIcon from '_assets/images/history.svg'
import HistoryActiveIcon from '_assets/images/history-active.svg'
import HomeIcon from '_assets/images/home.svg'
import HomeActiveIcon from '_assets/images/home-active.svg'
import StoresIcon from '_assets/images/stores.svg'
import StoresActiveIcon from '_assets/images/stores-active.svg'
import SettingsIcon from '_assets/images/settings.svg'
import TabIcon from '_atoms/TabIcon'
import { AuthStoreContext } from '_stores/index.js'
import { observer } from 'mobx-react-lite'
import Spinner from '_atoms/Spinner'
import TabBar from '_organisms/TabBar'
import { createStackNavigator } from '@react-navigation/stack'
import StoresScreen from '_scenes/StoresScreen'
import ModalNavigator from '_navigations/ModalNavigator'
import OffersScreen from '_scenes/OffersScreen'

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

const Tab = createBottomTabNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.GRAY_MEDIUM
    }
})

const RootStack = createStackNavigator()

const Tabs = () => (
  <Tab.Navigator sceneContainerStyle={styles.cardStyle}
                 initialRouteName={'Home'}
                 // tabBar={props => <TabBar {...props} />}
                 tabBarOptions={{
                     style: {
                         minHeight: 80,
                     },
                     showLabel: true
                 }}
                 screenOptions={{
                     tabBarActiveTintColor: Colors.PRIMARY,
                 }}
  >
      <Tab.Screen name={'Home'} component={HomeNavigator}
                  options={{
                      tabBarLabel: 'Home',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Home'} icon={focused ? <HomeActiveIcon/> : <HomeIcon/>}/>
                  }}
      />
      <Tab.Screen name="Stores" component={StoresScreen}
                  options={{
                      tabBarLabel: 'Stores',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Stores'} icon={focused ? <StoresActiveIcon/> : <StoresIcon/>}/>
                  }}
      />
      <Tab.Screen name="Offers" component={OffersScreen}
                  options={{
                      tabBarLabel: 'Offers',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Offers'} icon={focused ? <OffersActiveIcon/> : <OffersIcon/>}/>
                  }}
      />

      <Tab.Screen name="History" component={HistoryScreen}
                  options={{
                      tabBarLabel: 'History',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'History'} icon={focused ? <HistoryActiveIcon/> : <HistoryIcon/>}/>
                  }}
      />
      <Tab.Screen name="AccountSettings" component={AccountNavigator}
                  options={{
                      tabBarLabel: 'Account',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Settings'} icon={<SettingsIcon/>}/>
                  }}
      />
  </Tab.Navigator>
)

const AppNavigator = observer(() => {
    const authStore = React.useContext(AuthStoreContext)

    if (!authStore.userLoaded) {
        return <Spinner visible={true}/>
    }
    return (
      !authStore.user.id ?
        <AuthNavigator/>
        : (
          <RootStack.Navigator>
              <RootStack.Screen name={'App'} component={Tabs}/>
              <RootStack.Screen name={'Modal'} component={ModalNavigator}/>
          </RootStack.Navigator>
        )
    )
})

export default AppNavigator
