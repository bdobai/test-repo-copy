import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing } from '../../styles/index.js'
import Card from '_atoms/Card'
import { scaleSize } from '_styles/mixins'
import Shimmer from '_atoms/Shimmer'

const NotificationCardLoader = (props) => {

    return <Card style={[styles.container, props.style]}>
        <View style={styles.avatarWrapper}>
            <Shimmer width={scaleSize(100)} height={scaleSize(64)}/>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Shimmer style={{marginBottom: 5}} width={40} height={scaleSize(10)}/>
                <Shimmer width={40} height={scaleSize(10)}/>
            </View>
            <Shimmer width={200} height={scaleSize(20)}/>
        </View>
    </Card>
}

NotificationCardLoader.propTypes = {
    notification: PropTypes.object,
}

const styles = StyleSheet.create({
    container: {
        height: scaleSize(85),
        padding: Spacing.SPACING_3,
        paddingRight: Spacing.SPACING_6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'visible'
    },
    avatarWrapper: {
        width: scaleSize(50),
        height: scaleSize(50),
        borderRadius: scaleSize(25),
        backgroundColor: Colors.GRAY_MEDIUM,
        marginRight: Spacing.SPACING_3,
        overflow: 'hidden'
    },
})

export default NotificationCardLoader
