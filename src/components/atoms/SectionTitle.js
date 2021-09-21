import React from 'react'
import { StyleSheet, Text, Pressable, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '../../styles'
import { scaleSize } from '_styles/mixins'

const SectionTitle = props => {
    return <>
        <View style={[styles.sectionSubtitle, props.style]}>
            <Text style={styles.sectionSubtitleText}>{props.title}</Text>
            {props.see_all ? <Pressable style={styles.seeAllWrapper} onPress={() => props.see_all()}>
                <Text style={styles.seeAllText}>See all  ></Text>
            </Pressable> : null}
        </View>
        {props.description ? <View style={[styles.sectionDescription, props.style]}>
            <Text style={styles.sectionDescriptionText}>{props.description}</Text>
        </View> : null}
    </>
}

SectionTitle.propTypes = {
    title: PropTypes.any,
    description: PropTypes.any,
    style: PropTypes.any,
    see_all: PropTypes.any,
}

SectionTitle.defaultProps = {
    title: null,
    description: null,
    style: null,
    see_all: false,
}

const styles = StyleSheet.create({
    sectionSubtitle: {
        flexDirection: 'row',
        // paddingBottom: Spacing.SPACING_2,
        justifyContent: 'space-between',
        minHeight: scaleSize(25)
    },
    sectionSubtitleText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.SECONDARY + '40',
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    sectionDescription: {
        paddingBottom: Spacing.SPACING_2,
    },
    sectionDescriptionText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_10,
        lineHeight: Typography.LINE_HEIGHT_10,
    },
    seeAllWrapper: {
        height: scaleSize(30),
        minWidth: scaleSize(70),
    },
    seeAllText: {
        textAlign: 'right',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
})

export default SectionTitle
