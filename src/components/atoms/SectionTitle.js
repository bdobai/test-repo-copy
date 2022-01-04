import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '../../styles'

const SectionTitle = props => {
    return <View style={[styles.container, props.style ?? null]}>
        <Text style={[styles.title, props.textStyle ?? null]}>{props.children}</Text>
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
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_16,
        marginBottom: Spacing.SPACING_3,
        marginTop: Spacing.SPACING_6,
        fontWeight:'600'
    },
})

export default SectionTitle
