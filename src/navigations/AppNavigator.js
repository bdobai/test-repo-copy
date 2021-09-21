import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccountNavigator from '_navigations/AccountNavigator'
import AuthNavigator from '_navigations/AuthNavigator'
import HomeNavigator from '_navigations/HomeNavigator'
import HistoryScreen from '_scenes/HistoryScreen'
import { StyleSheet } from 'react-native'
import { Colors } from '_styles'
import OffersIcon from '_assets/images/offers.svg'
import HistoryIcon from '_assets/images/history.svg'
import HomeIcon from '_assets/images/home.svg'
import StoresIcon from '_assets/images/stores.svg'
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
                 tabBar={props => <TabBar {...props} />}
                 tabBarOptions={{
                     style: {
                         minHeight: 80,
                     },
                     showLabel: false
                 }}
  >
      <Tab.Screen name={'Home'} component={HomeNavigator}
                  options={{
                      tabBarLabel: '',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Home'} icon={<HomeIcon fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK}/>}/>
                  }}
      />
      <Tab.Screen name="Stores" component={StoresScreen}
                  options={{
                      tabBarLabel: '',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Stores'} icon={<StoresIcon fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK}/>}/>
                  }}
      />
      <Tab.Screen name="Offers" component={OffersScreen}
                  options={{
                      tabBarLabel: '',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Offers'} icon={<OffersIcon fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK}/>}/>
                  }}
      />

      <Tab.Screen name="History" component={HistoryScreen}
                  options={{
                      tabBarLabel: '',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'History'} icon={<HistoryIcon fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK}/>}/>
                  }}
      />
      <Tab.Screen name="AccountSettings" component={AccountNavigator}
                  options={{
                      tabBarLabel: '',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Settings'} icon={<SettingsIcon fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK}/>}/>
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
      !authStore.user.id && false ?
        <AuthNavigator/>
        : (
          <RootStack.Navigator headerMode={'none'}>
              <RootStack.Screen name={'App'} component={Tabs}/>
              <RootStack.Screen name={'Modal'} component={ModalNavigator}/>
          </RootStack.Navigator>
        )
    )
})

export default AppNavigator
