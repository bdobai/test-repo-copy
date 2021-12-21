import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthNavigator from '_navigations/AuthNavigator'
import HomeNavigator from '_navigations/HomeNavigator'
import HistoryScreen from '_scenes/HistoryScreen'
import { StyleSheet } from 'react-native'
import { Colors, Typography } from "_styles";
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

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

const Tab = createBottomTabNavigator()

const RootStack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.WHITE
    },
    authHeader: {
        borderWidth:0,
        elevation:0,
        shadowColor:'white',
    },
    headerTitle: {
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontWeight:'600',
    }
})

const Tabs = () => (
  <Tab.Navigator sceneContainerStyle={styles.cardStyle}
                 initialRouteName={'Home'}
                 tabBar={props => <TabBar {...props} />}
                 screenOptions={{
                     headerShown: false,
                     tabBarActiveTintColor: Colors.PRIMARY,
                 }}
  >
      <Tab.Screen name={'Home'} component={HomeNavigator}
                  options={{
                      tabBarLabel: 'Home',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Home'} icon={<HomeIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>}/>
                  }}
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
                      tabBarLabel: 'Account',
                      tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={'Settings'} icon={<UserIcon width={scaleSize(24)} height={scaleSize(24)} fill={focused ? Colors.PRIMARY : Colors.GRAY_DARK2}/>}/>,
                      headerShown: true,
                      cardStyle: styles.cardStyle,
                      headerTitleStyle: styles.headerTitle,
                      headerStyle: {
                          backgroundColor:Colors.PRIMARY,
                          borderColor: Colors.PRIMARY,
                          shadowColor: Colors.PRIMARY,
                          height: scaleSize(112),
                      },
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
              <RootStack.Screen name={'Modal'} component={ModalNavigator}/>
              <RootStack.Screen name={'AccountNavigator'} component={AccountNavigator} options={{
                  headerShown: false
              }}/>
          </RootStack.Navigator>
        )
    )
})

export default AppNavigator
