import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Radius, Spacing, Typography } from '../../styles'

const Card = props => {
    return (
      <View onLayout={props.onLayout}
            style={[styles.container, props.style, props.noPadding ? { padding: 0 } : null]}
      >
          {props.title ?
            <View style={[styles.titleContainer, props.subTitle ? {marginBottom: Spacing.SPACING_1} : {marginBottom: Spacing.SPACING_3}]}>
                <Text style={styles.titleText}>{props.title}</Text>
            </View>
            : null}
          {props.subTitle ?
            <View style={styles.subTitleContainer}>
                <Text style={styles.subTitleText}>{props.subTitle}</Text>
            </View>
            : null}
          {props.children}
      </View>
    )
}

Card.propTypes = {
    title: PropTypes.any,
    subTitle: PropTypes.string,
    style: PropTypes.any,
    onLayout: PropTypes.any,
    noPadding: PropTypes.bool,
}

Card.defaultProps = {
    title: null,
    subTitle: null,
    noPadding: false,
}

const styles = StyleSheet.create({
    container: {
        // borderWidth: 1,
        // borderColor: '#fff',
        borderRadius: Radius.RADIUS_1,
        padding: Spacing.SPACING_5,
        // zIndex: 1,
        backgroundColor: Colors.WHITE,
        flexDirection: 'column'
    },
    titleText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
    },
    subTitleContainer: {
        marginBottom: Spacing.SPACING_3
    },
    subTitleText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.MUTED,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
})

export default Card
