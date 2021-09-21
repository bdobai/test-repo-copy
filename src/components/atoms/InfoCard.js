import React from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Radius, Spacing, Typography } from '../../styles'
import Spinner from '_atoms/Spinner'
import { scaleSize } from '_styles/mixins'

const InfoCard = props => {
    return (
      <Pressable onPress={() => props.onPress ? props.onPress() : null} style={[styles.container, props.style, props.focused ? styles.focused : null]}>
          {props.loading ? <Spinner/> : <>
              {props.label !== null ? <Text style={[styles.labelText, props.focused ? styles.focusedText : null]}>{props.label}</Text> : null}
              {props.value !== null ? <Text style={[styles.valueText, props.focused ? styles.focusedText : null]}>{props.value}</Text> : null}
          </>}
      </Pressable>
    )
}

InfoCard.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    style: PropTypes.any,
    focused: PropTypes.any,
}

InfoCard.defaultProps = {
    label: null,
    value: null,
    focused: false,
}

const styles = StyleSheet.create({
    container: {
        height: scaleSize(75),
        borderRadius: Radius.RADIUS_1,
        padding: Spacing.SPACING_3,
        backgroundColor: Colors.WHITE,
        flexDirection: 'column'
    },
    focused: {
        backgroundColor: Colors.PRIMARY,
    },
    labelText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.MUTED,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        marginBottom: Spacing.SPACING_1
    },
    valueText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
    },
    focusedText: {
        color: Colors.WHITE,
    }
})

export default InfoCard
