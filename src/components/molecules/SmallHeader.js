import React from 'react'
import { SafeAreaView, StyleSheet, View, Dimensions, Image, Animated } from 'react-native'
import PropTypes from 'prop-types'
import { Spacing } from '../../styles/index.js'
import { scaleSize } from '_styles/mixins'
import { getStatusBarHeight } from 'react-native-status-bar-height';

const gradient2 = require('_assets/images/gradient2-small.png')

const SmallHeader = (props) => {
    const [translateY] = React.useState(new Animated.Value(scaleSize(-170)));
    const [showHeader, setShowHeader] = React.useState(false)

    React.useEffect(() => {
        if (props.visible && !showHeader) {
            setShowHeader(true)
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start()
        } else if(!props.visible && showHeader) {
            setShowHeader(false)
            Animated.timing(translateY, {
                toValue: scaleSize(-170),
                duration: 200,
                useNativeDriver: true
            }).start()
        }
    }, [props])

    return <Animated.View style={[styles.header, {
        transform: [
            {
                translateY: translateY
            }
        ]
    }, props.style ? props.style : null]}>
        <Image style={[styles.background, { height:Dimensions.get('window').width * 112/414, width:Dimensions.get('window').width }]} source={gradient2}/>
        <SafeAreaView style={styles.wrapper}>
            {props.children ? <View style={styles.childrenWrapper}>{props.children}</View> :
            <View style={styles.container}>
                <View style={styles.leftSlot}>{props.left}</View>
                <View style={styles.centerSlot}>{props.center}</View>
                <View style={styles.rightSlot}>{props.right}</View>
            </View>}
        </SafeAreaView>
    </Animated.View>
}

SmallHeader.propTypes = {
    right: PropTypes.object,
    left: PropTypes.object,
    center: PropTypes.object,
    size: PropTypes.string,
}

SmallHeader.defaultProps = {
    bg: true,
}

const styles = StyleSheet.create({
    header:{
        left: 0,
        top: 0,
        position: 'absolute',
        zIndex: 10
    },
    background: {
        left: 0,
        top: 0,
        position: 'absolute',
    },
    wrapper: {
        minHeight: scaleSize(Dimensions.get('window').width * 170/414),
        paddingTop: scaleSize(getStatusBarHeight() + 10)
    },
    container: {
        paddingLeft: Spacing.SPACING_5,
        paddingRight: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_2,
        paddingBottom: Spacing.SPACING_10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: scaleSize(50)
    },
    childrenWrapper: {
        paddingTop: Spacing.SPACING_2,
        paddingBottom: Spacing.SPACING_10,
    },
    leftSlot: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    centerSlot: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    rightSlot: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
})

export default SmallHeader
