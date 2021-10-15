import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import PropTypes from 'prop-types'
import { scaleSize } from '_styles/mixins'
import { Animated } from 'react-native'

const TabIcon = (props) => {
    const [translateValue] = useState(new Animated.Value(0))

    // useEffect(() => {
    //     animateIcon(props.focused)
    // }, [props.focused])
    //
    // const animateIcon = (value) =>{
    //     Animated.timing(translateValue, {
    //         toValue: value ? scaleSize(-4) : 0,
    //         duration: 300,
    //         useNativeDriver: true
    //     }).start()
    // }

    return <View style={styles.container}>
        <Animated.View style={[styles.iconContainer, props.containerStyle, {
            transform: [{ translateY: translateValue }],
        }]}>
            {props.icon}
        </Animated.View>
    </View>
}

TabIcon.propTypes = {
    containerStyle: PropTypes.any,
    focused: PropTypes.bool,
    icon: PropTypes.any,
}
const styles = StyleSheet.create({
    container: {
        width: scaleSize(38),
        height: scaleSize(38),
        paddingTop: Platform.OS === 'ios' ? 22 : 15,
        paddingBottom: 20,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 48,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }
})

export default TabIcon
