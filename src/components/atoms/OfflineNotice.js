import React, {useEffect, useState} from 'react'
import { StyleSheet, SafeAreaView, Text, Animated } from 'react-native'
import { Colors, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'
import { observer } from 'mobx-react-lite'
import NetInfo from "@react-native-community/netinfo";
import { getStatusBarHeight } from 'react-native-status-bar-height'

const OfflineNotice = observer(props => {
    const [translateValue] = useState(new Animated.Value(-100))
    const [isConnected, setIsConnected] = useState(true);

    const showNotification = (isConnected) => {
        setIsConnected(isConnected);
        Animated.timing(translateValue, {
            toValue: isConnected ? -100 : 0,
            duration: 700,
            useNativeDriver: true,
        }).start()
    }

    useEffect(() => {
        showNotification(false)
        const unsubscribe = NetInfo.addEventListener(state => {
            showNotification(state.isConnected)
        });

        return () => {
            unsubscribe();
        };
    }, [])

    return <Animated.View style={[styles.wrapper,
                {
                    transform: [{ translateY: translateValue }],
                },
            ]}>
          <SafeAreaView style={[styles.container, isConnected ? {backgroundColor: Colors.SUCCESS} : {backgroundColor: Colors.DANGER}]}>
              <Text style={styles.text}>{!isConnected ? 'No internet connection' : 'Connected'}</Text>
          </SafeAreaView>
    </Animated.View>
})

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 999,
    },
    container: {
        width: '100%',
        paddingTop: scaleSize(getStatusBarHeight()),
        paddingBottom: scaleSize(8)
    },
    text: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.WHITE,
    }
})

export default OfflineNotice
