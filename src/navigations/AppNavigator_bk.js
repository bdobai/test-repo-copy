import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthNavigator from '_navigations/AuthNavigator'
import HomeNavigator from '_navigations/HomeNavigator'
import HistoryScreen from '_scenes/HistoryScreen'
import { Colors } from "_styles";
import HistoryIcon from '_assets/images/nav/history.svg'
import HomeIcon from '_assets/images/nav/home.svg'
import StoresIcon from '_assets/images/nav/stores.svg'
import UserIcon from '_assets/images/user.svg'
import TabIcon from '_atoms/TabIcon'
import { AuthStoreContext } from '_stores/index.js'
import { observer } from 'mobx-react-lite'
import Spinner from '_atoms/Spinner'
import TabBar from '_organisms/TabBar'
import { createStackNavigator } from '@react-navigation/stack'
import StoresScreen from '_scenes/StoresScreen'
import ModalNavigator from '_navigations/ModalNavigator'
import { scaleSize } from '_styles/mixins';
import AccountSettingsScreen from "_scenes/AccountSettingsScreen";
import AccountNavigator from "_navigations/AccountNavigator";
import { navigationStyles } from "_styles/navigation";
import HomeHeaderTitle from "_atoms/HomeHeaderTitle";

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

const Tab = createBottomTabNavigator()

const RootStack = createStackNavigator()

const Tabs = () => (
  <Tab.Navigator sceneContainerStyle={navigationStyles.whiteCardStyle}
                 initialRouteName={'Home'}
                 tabBar={props => <TabBar {...props} />}
                 screenOptions={{
                     headerShown: false,
                     tabBarActiveTintColor: Colors.PRIMARY,
                 }}
  >
      <Tab.Screen name={'Home'} component={HomeNavigator}
                  options={({navigation}) => ({
                      headerShown: true,
                      tabBarLabel: 'Home',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Home'} icon={<HomeIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>}/>,
                      header: () => <HomeHeaderTitle onInbox={() => navigation.navigate('Modal', {screen: 'Messages'})}/>,
                  })}
      />
      <Tab.Screen name="Stores" component={StoresScreen}
                  options={{
                      tabBarLabel: 'Stores',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Stores'} icon={<StoresIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>}/>
                  }}
      />
      <Tab.Screen name="History" component={HistoryScreen}
                  options={{
                      tabBarLabel: 'History',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'History'} icon={<HistoryIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>}/>
                  }}
      />
      <Tab.Screen name="Account" component={AccountSettingsScreen}
                  options={{
                      headerTitleAlign: 'center',
                      tabBarLabel: 'Account',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Settings'} icon={<UserIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>}/>,
                      headerShown: true,
                      cardStyle: navigationStyles.cardStyle,
                      headerTitleStyle: navigationStyles.accountHeader,
                      headerStyle: navigationStyles.primaryHeader,
                      headerTitle: 'How Can We Help?',
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
              <RootStack.Screen name={'App'} component={Tabs} options={{
                  headerShown: false
              }}/>
              <RootStack.Screen name={'Modal'} component={ModalNavigator} options={{
                  headerShown: false
              }}/>
              <RootStack.Screen name={'AccountNavigator'} component={AccountNavigator} options={{
                  headerShown: false
              }}/>
          </RootStack.Navigator>
        )
    )
})

export default AppNavigator
