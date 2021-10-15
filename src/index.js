import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { View, Text, StatusBar, Alert, Linking, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import NotificationsSystem from './partials/NotificationsSystem'
import AppNavigator, { navigationRef, isReadyRef } from './navigations/AppNavigator_bk'
import { Colors, Typography } from '_styles';
import { AuthStoreContext, NotificationsStoreContext } from '_stores'
import { observer } from 'mobx-react-lite'
import { reaction } from 'mobx'
import RNBootSplash from "react-native-bootsplash";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import OfflineNotice from '_atoms/OfflineNotice'
// import analytics from '@react-native-firebase/analytics';
import { parse_query_string } from '_utils/helpers'

Number.prototype.clampPercentBar = function() {
    return this < 100 ? this : 100;
};

const Index: () => React$Node = observer(() => {
    const authStore = React.useContext(AuthStoreContext);
    const notificationsStore = React.useContext(NotificationsStoreContext);
    const routeNameRef = useRef();

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    // Text.defaultProps.style = {
    //     fontFamily: Typography.FONT_PRIMARY_BOLD
    // };

    async function getUrlAsync () {
        const initialUrl = await Linking.getInitialURL();
        handleDeepLink(initialUrl)
    }

    useEffect(() => {
        if (authStore.userLoaded) {
            RNBootSplash.hide({ fade: true });
            StatusBar.setBarStyle('light-content')
            if (Platform.OS === 'android') {
                StatusBar.setTranslucent(true)
                StatusBar.setBackgroundColor('transparent')
            }
        }
        changeNavigationBarColor('#ffffff', true);
        authStore.getUser();

        Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url)
        })

        // getUrlAsync()
    }, []);

    const handleDeepLink = (url) => {
        if (!isReadyRef.current || !navigationRef.current || !navigationRef.current.getRootState()) {
            setTimeout(() => {
                handleDeepLink(url)
            }, 1000)
            return;
        }

        if (!url) {
            return
        }
        const parts = url.split('://')
        if (!parts[1]) {
            return;
        }

        const path = parts[1].replace('/share', '').replace('portal.chapplabs.com/', '');
        if(!path) {
            return;
        }
        if (path === 'events') {
            navigationRef.current.navigate('Modal', {screen: 'Browse.Events'})
        }
        if (path === 'fundraisers') {
            navigationRef.current.navigate('Modal', {screen: 'Browse.Fundraisers'})
        }
        if (path === 'organizations') {
            navigationRef.current.navigate('Modal', {screen: 'Browse.Organizations'})
        }
        if (path === 'donors') {
            navigationRef.current.navigate('Social')
        }
        let match = null;
        match = path.match(/events\/(.*)/)
        if(match && match.length > 0) {
            navigationRef.current.navigate('Modal', {screen: 'Event', params: {event_id: match[1]}})
        }
        match = path.match(/fundraisers\/(.*)/)
        if(match && match.length > 0) {
            navigationRef.current.navigate('Modal', {screen: 'Fundraiser', params: {fundraiser_id: match[1]}})
        }
        match = path.match(/organizations\/(.*)/)
        if(match && match.length > 0) {
            navigationRef.current.navigate('Modal', {screen: 'Organization', params: {organization_id: match[1]}})
        }
        match = path.match(/donors\/(.*)/)
        if(match && match.length > 0) {
            navigationRef.current.navigate('Modal', {screen: 'DonorDetails', params: {donor_id: match[1]}})
        }

        if (path.indexOf('register') > -1) {
            const params = parse_query_string(path)
            let route_params = {}
            if(params && params.email) {
                route_params = {
                    email: params.email
                }
            }
            navigationRef.current.navigate('Register', route_params)
        }

    }

    const onOpenNotification = (notification) => {
        console.log({notification})
        if (!notification.additionalData) {
            return;
        }

        if (!isReadyRef.current || !navigationRef.current || !navigationRef.current.getRootState() ||!authStore.userLoaded) {
            setTimeout(() => {
                onOpenNotification(notification)
            }, 1000)
            return;
        }

        switch (notification.additionalData.type) {
            case 'SHOW_TICKET':
                if (notification.additionalData.ticket_id) {
                    navigationRef.current.navigate('AccountSettings', {screen: 'AccountSettings.TicketDetails', params: {ticket_id: notification.additionalData.ticket_id}})
                }else if (notification.additionalData.ticket) {
                    navigationRef.current.navigate('AccountSettings', {screen: 'AccountSettings.TicketDetails', params: {ticket: notification.additionalData.ticket}})
                }
                break;
            case 'SHOW_EVENT':
                if (notification.additionalData.event_id) {
                    navigationRef.current.navigate('Modal', {screen: 'Event', params: {event_id: notification.additionalData.event_id}})
                }else if (notification.additionalData.event) {
                    navigationRef.current.navigate('Modal', {screen: 'Event', params: {event: notification.additionalData.event}})
                }
                break;
            case 'SHOW_FUNDRAISER':
                if (notification.additionalData.fundraiser_id) {
                    navigationRef.current.navigate('Modal', {screen: 'Fundraiser', params: {fundraiser_id: notification.additionalData.fundraiser_id}})
                }else if (notification.additionalData.fundraiser) {
                    navigationRef.current.navigate('Modal', {screen: 'Fundraiser', params: {fundraiser: notification.additionalData.fundraiser}})
                }
                break;
            case 'SHOW_ORGANIZATION':
                if (notification.additionalData.organization_id) {
                    navigationRef.current.navigate('Modal', {screen: 'Organization', params: {organization_id: notification.additionalData.organization_id}})
                }else if (notification.additionalData.organization) {
                    navigationRef.current.navigate('Modal', {screen: 'Organization', params: {organization: notification.additionalData.organization}})
                }
                break;
        }
    }

    reaction(() => authStore.userLoaded,
      (value, previousValue, reaction) => {
          if (value === true && previousValue === false) {
              RNBootSplash.hide({ fade: true });
              StatusBar.setBarStyle('light-content')
              if (Platform.OS === 'android') {
                  StatusBar.setTranslucent(true)
                  StatusBar.setBackgroundColor('transparent')
              }
          }
    });

    return (
		<NavigationContainer
          ref={navigationRef}
          onReady={() => {
              isReadyRef.current = true;
              getUrlAsync().catch((e) => console.log(e))
          }}
          onStateChange={async () => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.current.getCurrentRoute().name;

              // if (previousRouteName !== currentRouteName) {
              //     await analytics().logScreenView({
              //         screen_name: currentRouteName,
              //         screen_class: currentRouteName
              //     });
              // }
              routeNameRef.current = currentRouteName;
          }}
        >
            {/*<StatusBar translucent barStyle="light-content" backgroundColor="transparent" />*/}
            <View style={{ flex: 1, backgroundColor: Colors.GRAY_MEDIUM }}>
                <OfflineNotice/>
				<AppNavigator/>

                <NotificationsSystem/>
            </View>
		</NavigationContainer>
	);
});

export default Index;
