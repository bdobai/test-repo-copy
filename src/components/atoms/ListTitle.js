import React from 'react'
import { StyleSheet, Text, Pressable, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '../../styles'
import { scaleSize } from '_styles/mixins'

const ListTitle = props => {
    return (
      <View style={styles.container}>
          <Text style={[styles.titleText, props.size === 'small' ? styles.titleTextSmall : null]}>{props.title}</Text>
          {typeof props.count != 'undefined' ? <Text style={styles.countText}>{props.count}</Text> : null}
          {props.see_all ? <Pressable style={styles.seeAllWrapper} onPress={() => props.see_all()}>
              <Text style={styles.seeAllText}>See all ></Text>
          </Pressable> : null}
          {props.action ? props.action() : null}
      </View>
    )
}

ListTitle.propTypes = {
    title: PropTypes.any,
    count: PropTypes.number,
    size: PropTypes.any,
    see_all: PropTypes.any,
}

ListTitle.defaultProps = {
    title: null,
    count: null,
    see_all: null,
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_3
    },
    titleText: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_24,
        lineHeight: Typography.LINE_HEIGHT_24,
    },
    titleTextSmall: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
    },
    countText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    seeAllWrapper: {
        height: scaleSize(30),
        minWidth: scaleSize(70),
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    seeAllText: {
        textAlign: 'right',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
})

export default ListTitle
