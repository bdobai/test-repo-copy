import React, { Component, useEffect, useState } from 'react'
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View, Pressable } from 'react-native'
import ErrorIcon from '_assets/images/alerts/error.svg'
import SuccessIcon from '_assets/images/alerts/success.svg'
import WarningIcon from '_assets/images/alerts/warning.svg'
import InfoIcon from '_assets/images/alerts/info.svg'
// import CloseIcon from '_assets/images/alerts/close.svg'
import PropTypes from 'prop-types'
import { Colors, Radius, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'

const width = Dimensions.get('window').width

const Notification = (props) => {
    const [position] = useState(new Animated.ValueXY({ x: 0, y: -100 }));
    const opacity = position.x.interpolate({
        inputRange: [-width, 0, width],
        outputRange: [0, 1, 0]
    })
    const [height] = useState(new Animated.Value(scaleSize(90)));

    useEffect(() => {
        setTimeout(function () {
            closeNotification()
        }, props.timing ? props.timing : 6000)
        showNotification()
    },[])

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const { dx, dy } = gestureState
            return dx > 8 || dx < -8 || dy > 8 || dy < -8
        },
        onPanResponderMove: (event, gesture) => {
            position.setValue({ x: gesture.dx, y: 0 })
            if (gesture.dx > width/2 || gesture.dx < -width/2) {
                Animated.timing(position, {
                    toValue: { x: 600, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }).start()
            }
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dx > 50 && gesture.vx > 10) {
                Animated.timing(position, {
                    toValue: { x: 600, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }).start(function onComplete () {
                    removeNotification()
                })
            } else if (gesture.dx > 150) {
                Animated.timing(position, {
                    toValue: { x: 600, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }).start(function onComplete () {
                    removeNotification()
                })
            } else if (gesture.dx < -50 && gesture.vx < -10) {
                Animated.timing(position, {
                    toValue: { x: -600, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }).start(function onComplete () {
                    removeNotification()
                })
            } else if (gesture.dx < -150) {
                Animated.timing(position, {
                    toValue: { x: -600, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }).start(function onComplete () {
                    removeNotification()
                })
            } else {
                Animated.timing(position, {
                    toValue: { x: 0, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }).start()
            }
        }
    })

    const removeNotification = () => {
        Animated.timing(height, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false
        }).start(function onComplete () {
            props.onRemove(props.notification)
        })
    }

    const closeNotification = () => {
        Animated.timing(position, {
            toValue: { x: width, y: 0 },
            duration: 600,
            useNativeDriver: false
        }).start(function onComplete () {
            removeNotification()
        })
    }

    const showNotification = () => {
        Animated.timing(position, {
            toValue: { x: 0, y: 0 },
            duration: 250,
            useNativeDriver: false
        }).start()
    }

    const renderIcon = () => {
        switch (props.type) {
            case 'success':
                return (
                  <View style={styles.iconWrapper}><SuccessIcon height={25}/></View>
                )
            case 'info':
                return (
                  <View style={styles.iconWrapper}><InfoIcon height={25}/></View>
                )
            case 'warning':
                return (
                  <View style={styles.iconWrapper}><WarningIcon height={25}/></View>
                )
            case 'error':
                return (
                  <View style={styles.iconWrapper}><ErrorIcon height={25}/></View>
                )
            default:
                return null
        }
    }

    return <Animated.View {...panResponder.panHandlers} style={[position.getLayout(), {height: height, zIndex: 25, opacity: opacity}]}>
        <Pressable onPress={() => {
            if (props.onPress) {
                props.onPress()
                closeNotification()
            }
        }}
          style={[styles.NotificationContainer, props.style, styles[props.type + 'Color']]}>
            <View style={styles.Notification}>
                {renderIcon()}
                <View style={styles.NotificationGroupText}>
                    {props.title ? <Text style={styles.NotificationGroupTitle}>{props.title}</Text> : null}
                    {props.description ? <Text style={styles.NotificationGroupDescription}>{props.description}</Text> : null}
                </View>
                {/*{Platform.OS === 'ios' ? <Pressable style={styles.closeWrapper} onPress={() => closeNotification()}><CloseIcon height={35}/></Pressable> : null}*/}
            </View>
        </Pressable>
    </Animated.View>
}

Notification.propTypes = {
    type: PropTypes.string,
    style: PropTypes.any,
    first: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
}

const styles = StyleSheet.create({
    NotificationContainer: {
        width: Dimensions.get('window').width - scaleSize(50),
        marginLeft: scaleSize(25),
        marginRight: scaleSize(25),
        marginBottom: scaleSize(10),
        borderRadius: Radius.RADIUS_1,
        position: 'relative',
        zIndex: 25,
        elevation: 2,
        top: 0,
        left: 0,
        backgroundColor: '#FF3333',
    },
    iconWrapper: {
        width: scaleSize(75),
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeWrapper: {
        width: scaleSize(50),
        height: scaleSize(80),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 26,
    },
    Notification: {
        minHeight: scaleSize(80),
        width: '100%',
        // elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    NotificationGroupText: {
        flex: 1,
        paddingTop: scaleSize(15),
        paddingBottom: scaleSize(15),
        minHeight: scaleSize(80),
        justifyContent: 'flex-start'
    },
    NotificationGroupDescription: {
        color: '#fff',
        fontSize: Typography.FONT_SIZE_10,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
    },
    NotificationGroupTitle: {
        color: '#fff',
        marginBottom: Spacing.SPACING_1,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
    },
    warningColor: {
        backgroundColor: '#ffd76a',
    },
    successColor: {
        backgroundColor: '#4bdf77',
    },
    infoColor: {
        backgroundColor: Colors.SECONDARY,
    },
    errorColor: {
        backgroundColor: '#ff6a6a',
    }
})
export default Notification
