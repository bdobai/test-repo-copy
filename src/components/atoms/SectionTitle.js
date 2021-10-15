import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '../../styles'

const SectionTitle = props => {
    return <View style={[styles.container, props.style ?? null]}>
        <Text style={[styles.title, props.textStyle ?? null]}>MY PROFILE</Text>
    </View>
}

SectionTitle.propTypes = {
    title: PropTypes.any,
    style: PropTypes.any,
    textStyle: PropTypes.any,
}

SectionTitle.defaultProps = {
    title: null,
    style: null,
    textStyle: null,
}

const styles = StyleSheet.create({
    container: {

    },
    title: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        marginBottom: Spacing.SPACING_3
    },
})

export default SectionTitle
