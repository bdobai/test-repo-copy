import React from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Radius, Spacing, Typography } from '../../styles/index.js'
import Card from '_atoms/Card'
import { scaleSize } from '_styles/mixins'

const Tabs = (props) => {
    return  <Card style={styles.tabsCard}>
        {props.tabs.map((tab, index) => <TouchableWithoutFeedback onPress={() => props.onChange(index)} key={index}>
            <View style={[styles.tab]}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.tabText, tab.width ? {width: tab.width} : null, index === props.index ? styles.tabTextFocused : null]}>{tab.label}</Text>
                {index === props.index ? <View style={styles.bottomBar}/> : null}
            </View>
        </TouchableWithoutFeedback>)}
    </Card>
}

Tabs.propTypes = {
    tabs: PropTypes.any,
}

const styles = StyleSheet.create({
    tabsCard: {
        marginBottom: Spacing.SPACING_5,
        paddingTop: Spacing. SPACING_4,
        paddingBottom: Spacing. SPACING_3,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    tab: {
        marginHorizontal: scaleSize(13),
        borderBottomWidth: 3,
        borderBottomColor: Colors.WHITE,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    tabText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
        textAlign: 'center',
        marginBottom: Spacing.SPACING_1,
    },
    tabTextFocused: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
    },
    bottomBar: {
        height: 3,
        width: scaleSize(25),
        backgroundColor: Colors.PRIMARY
    }
})

export default Tabs
