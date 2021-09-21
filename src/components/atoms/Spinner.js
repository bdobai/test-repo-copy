import React from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Colors, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'

const SIZES = ['small', 'large']

const Spinner = props => {

    if (!props.visible) {
        return null
    }
    return (
      <View style={props.overlay ? styles.overlayBackground : [styles.background, props.size === 'small' ? { height: scaleSize(20) } : null]}>
          <ActivityIndicator color={props.color} size={props.size} style={{ flex: 1 }}/>
          {props.textContent ? <View style={styles.textContainer}>
              <Text style={[styles.textContent, props.textStyle]}>{props.textContent}</Text>
          </View> : null}
      </View>
    )
}

Spinner.propTypes = {
    visible: PropTypes.bool,
    overlay: PropTypes.bool,
    textContent: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.oneOf(SIZES),
}

Spinner.defaultProps = {
    visible: true,
    overlay: false,
    textContent: '',
    color: Colors.PRIMARY,
    size: 'large',
}

const styles = StyleSheet.create({
    overlayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 36
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContent: {
        fontSize: 19,
        color: '#000',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
    },
})

export default Spinner

