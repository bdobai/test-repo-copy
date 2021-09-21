import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import PropTypes from 'prop-types'

const PageTitle = (props) => {
    return <View style={styles.wrapper}>
        {props.label ? <Text style={styles.labelText}>{props.label}</Text> : null}
        <Text numberOfLines={1} ellipsizeMode='tail' style={props.size === 'xsmall' ? styles.titleXSmallText : props.size === 'small' ? styles.titleSmallText : styles.titleText}>{props.title}</Text>
    </View>
}

PageTitle.propTypes = {
    title: PropTypes.string,
    label: PropTypes.string,
    size: PropTypes.string,
}

PageTitle.defaultProps = {
    title: '',
}

const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'column',
      alignItems: 'center'
    },
    labelText: {
        fontFamily: Typography.FONT_SECONDARY_REGULAR,
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_10,
        lineHeight: Typography.LINE_HEIGHT_10,
        // marginBottom: Spacing.SPACING_1
    },
    titleText: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_30,
        lineHeight: Typography.LINE_HEIGHT_30,
    },
    titleSmallText: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_24,
        lineHeight: Typography.LINE_HEIGHT_24,
    },
    titleXSmallText: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
    },
})

export default PageTitle
