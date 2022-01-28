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
    }

    const onOpenNotification = (notification) => {
        console.log({notification})
        if (!notification.additionalData) {
            return;
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
