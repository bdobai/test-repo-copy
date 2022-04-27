import React, { useEffect } from "react";
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
import ConfirmSmsScreen from "_scenes/auth/ConfirmSmsScreen";
import EditPhoneNumber from "_scenes/auth/EditPhoneNumber";
import BackButton from "_atoms/BackButton";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useNotifications from "_utils/notifications-hook";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
import { request } from "_utils/request";


export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

const Tab = createBottomTabNavigator()

const RootStack = createStackNavigator()
const Stack = createStackNavigator()

const Tabs = observer(() => {
    const authStore = React.useContext(AuthStoreContext)
    const navigation = useNavigation()

    const handleRouting = (value) => {
        switch (value) {
            case 'giftCards':
                return navigation.navigate('AccountNavigator', {screen:'AccountSettings.GiftCards'})
            case 'balance':
                return navigation.navigate('Modal', {screen:'Gift Cards'})
            case 'stores':
                return navigation.navigate('Stores')
            case 'storesClickAndCollect':
                return navigation.navigate('Stores', {clickAndCollect:true})
            case 'history':
                return navigation.navigate('History')
            case 'account':
                return navigation.navigate('Account')
            case 'personalInfo':
                return navigation.navigate('AccountNavigator',  {screen:'AccountSettings.Info'})
            case 'faq':
                return navigation.navigate('AccountNavigator',  {screen:'AccountSettings.FAQ'})
            case 'menu':
                return Linking.openURL('https://docs.google.com/gview?embedded=true&url=https://www.costacoffee.ae/docs/costadeliverymenu.pdf');
        }
    }

    const onSuccess = (data, id) => {
        if(!data.length  || !id) return;
        const index = data.findIndex((item) => (item.message?.message_id == id || item.user_message_id == id))
        if(index===-1) return;
        navigation.navigate('Modal', {screen: 'Messages.Details', params:{'item': data[index]}})

    }

    const getMessages = (onSuccess) => {
        request('/user/message/list.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: function (response) {
                onSuccess && onSuccess(response)
            },
            error: (error) => {
            }
        });
    }

    const onNotification = (id) => {
        if(!id) return;
        const type = id?.toString().split('type:').pop()
        if(type && id.includes('type')){
            handleRouting(type);
            return
        }
        getMessages((data) => onSuccess(data, id))
    }

    useNotifications(authStore?.user?.email_address, authStore?.user?.id, onNotification);
    return (
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
                            // headerStyle: navigationStyles.primaryHeader,
                            // headerTitle:'',
                            header: () => <HomeHeaderTitle onInbox={() => navigation.navigate('Modal', {screen: 'Messages'})}/>,
                        })}
            />
            <Tab.Screen name="Stores" component={StoresScreen}
                        options={{
                            unmountOnBlur:true,
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
})

const ValidationNavigator = () => (
    <Stack.Navigator screenOptions={{
        cardStyle: navigationStyles.cardStyle,
        headerShown: true,
        headerTitle: 'Account Validation',
        headerTitleStyle: navigationStyles.headerTitle,
        headerStyle: navigationStyles.primaryHeader,
    }}>
        <Stack.Screen name={'ConfirmSms'} component={ConfirmSmsScreen}/>
        <Stack.Screen name={'EditPhoneNumber'} component={EditPhoneNumber} options={{
            headerLeft:() => <BackButton color={Colors.WHITE}/>,
        }}/>
    </Stack.Navigator>
)

const AppNavigator = observer(() => {
    const authStore = React.useContext(AuthStoreContext)

    const handleDynamicLink = (link) => {
        if(!link) return;
        let sessionKey = link.url?.split('session_key=').pop();
        sessionKey = sessionKey.split('&')[0]
        AsyncStorage.setItem('session_key', sessionKey).then(() => {
            authStore.getUser();
        })
    }

    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then(link => {
                handleDynamicLink(link)
            });
    }, []);

    useEffect(() => {
        dynamicLinks().onLink((link) => {
            handleDynamicLink(link)
        })
    })


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
