import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountNavigator from '_navigations/AccountNavigator'
import AuthNavigator from '_navigations/AuthNavigator'
import HomeNavigator from '_navigations/HomeNavigator'
import HistoryScreen from '_scenes/HistoryScreen'
import { Colors } from '_styles'
import OffersIcon from '_assets/images/nav/offers.svg'
import HistoryIcon from '_assets/images/nav/history.svg'
import HomeIcon from '_assets/images/nav/home.svg'
import StoresIcon from '_assets/images/nav/stores.svg'
import SettingsIcon from '_assets/images/nav/settings.svg'
import { AuthStoreContext } from '_stores/index.js'
import { observer } from 'mobx-react-lite'
import Spinner from '_atoms/Spinner'
import { createStackNavigator } from '@react-navigation/stack'
import StoresScreen from '_scenes/StoresScreen'
import ModalNavigator from '_navigations/ModalNavigator'
import OffersScreen from '_scenes/OffersScreen'
import { scaleSize } from '_styles/mixins';
import AccountSettingsScreen from "_scenes/AccountSettingsScreen";
import { navigationStyles } from "_styles/navigation";
import ConfirmSmsScreen from "_scenes/auth/ConfirmSmsScreen";
import EditPhoneNumber from "_scenes/auth/EditPhoneNumber";

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

const Tab = createBottomTabNavigator()

const RootStack = createStackNavigator()
const Stack = createStackNavigator()

const Tabs = () => (
  <Tab.Navigator sceneContainerStyle={navigationStyles.cardStyle}
                 initialRouteName={'Home'}
                 screenOptions={{
                     headerShown: false,
                     tabBarActiveTintColor: Colors.PRIMARY,
                     tabBarStyle: {
                         minHeight: scaleSize(80),
                         borderTopWidth: 0
                     }
                 }}
  >
      <Tab.Screen name={'Home'} component={HomeNavigator}
                  options={{
                      tabBarLabel: 'Home',
                      tabBarIcon: ({ focused }) => <HomeIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>
                  }}
      />
      <Tab.Screen name="Stores" component={StoresScreen}
                  options={{
                      tabBarLabel: 'Stores',
                      tabBarIcon: ({ focused }) => <StoresIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>
                  }}
      />
      <Tab.Screen name="Offers" component={OffersScreen}
                  options={{
                      tabBarLabel: 'Offers',
                      tabBarIcon: ({ focused }) => <OffersIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>
                  }}
      />

      <Tab.Screen name="History" component={HistoryScreen}
                  options={{
                      tabBarLabel: 'History',
                      tabBarIcon: ({ focused }) => <HistoryIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>
                  }}
      />
      <Tab.Screen name="AccountSettings" component={AccountSettingsScreen}
                  options={{
                      tabBarLabel: 'Account',
                      tabBarIcon: ({ focused }) => <SettingsIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>
                  }}
      />
  </Tab.Navigator>
)

const ValidationNavigator = () => (
    <Stack.Navigator screenOptions={{
        cardStyle: navigationStyles.cardStyle,
        headerShown: true,
        headerTitle: 'Account Validation',
        headerTitleStyle: navigationStyles.headerTitle,
        headerStyle: navigationStyles.primaryHeader,
    }}>
        <Stack.Screen name={'ConfirmSms'} component={ConfirmSmsScreen}/>
        <Stack.Screen name={'EditPhoneNumber'} component={EditPhoneNumber}/>
    </Stack.Navigator>
)

const AppNavigator = observer(() => {
    const authStore = React.useContext(AuthStoreContext)

    if (!authStore.userLoaded) {
        return <Spinner visible={true}/>
    }
    return (
        !authStore.user.id ?
            <AuthNavigator/>
            : !authStore.userValidated ? <ValidationNavigator/> : (
          <RootStack.Navigator>
              <RootStack.Screen name={'App'} component={Tabs} options={{
                  headerShown: false
              }}/>
              <RootStack.Screen name={'Modal'} component={ModalNavigator}/>
              <RootStack.Screen name={'AccountNavigator'} component={AccountNavigator}/>
          </RootStack.Navigator>
        )
    )
})

export default AppNavigator
