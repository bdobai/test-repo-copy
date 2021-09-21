import React from 'react'
import { SafeAreaView, StyleSheet, View, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import { Spacing } from '../../styles/index.js'
import { scaleSize } from '_styles/mixins'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { HEADER_SPACE } from '_styles/spacing'

const Header = (props) => {
    return <View style={[styles.header, props.style ? props.style : null]}>
        <SafeAreaView style={styles.wrapper}>
            {props.children ? <View style={styles.childrenWrapper}>{props.children}</View> :
            <View style={styles.container}>
                <View style={styles.leftSlot}>{props.left}</View>
                <View style={styles.centerSlot}>{props.center}</View>
                <View style={styles.rightSlot}>{props.right}</View>
            </View>}
        </SafeAreaView>
    </View>
}

Header.propTypes = {
    right: PropTypes.object,
    left: PropTypes.object,
    center: PropTypes.object,
    size: PropTypes.string,
}

Header.defaultProps = {
    bg: true,
}

const styles = StyleSheet.create({
    header: {
        zIndex: 10
    },
    wrapper: {
        minHeight: scaleSize(Dimensions.get('window').width * (150 - HEADER_SPACE)/414),
        // minHeight: scaleSize(Dimensions.get('window').width * 170/414),
        paddingTop: scaleSize(getStatusBarHeight() + 10)
    },
    container: {
        paddingLeft: Spacing.SPACING_5,
        paddingRight: Spacing.SPACING_5,
        // marginTop: Spacing.SPACING_2,
        paddingBottom: Spacing.SPACING_2,
        flexDirection: 'row',
        // minHeight: scaleSize(50)
    },
    childrenWrapper: {
        paddingTop: Spacing.SPACING_2,
        // paddingBottom: Spacing.SPACING_2,
    },
    leftSlot: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: scaleSize(50)
    },
    centerSlot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: scaleSize(50)
    },
    rightSlot: {
        minHeight: scaleSize(50),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
})

export default Header
