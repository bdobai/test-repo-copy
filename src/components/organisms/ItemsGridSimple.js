import React from 'react'
import { StyleSheet, Text, View, } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '_styles'
import { observer } from 'mobx-react-lite'
import { scaleSize } from '_styles/mixins'
import { HEADER_SPACE } from '_styles/spacing'

const ItemsGridSimple = observer((props) => {
    const {
        loading,
        columns,
        items,
        _renderItem,
        _renderLoader,
    } = props

    const _renderRow = (item, rowIndex) => {
        let emptyItems = [];
        for (let i = 0; i < columns - item.length; i++){
            emptyItems.push('')
        }
        return (
          <View key={rowIndex} style={[styles.gridRow, props.withPadding ? styles.rowPadding : null,props.rowStyle ? props.rowStyle : null]}>
              {item.map((item, index) => (
                <View key={index} style={[{flex: 1}, columns > 1 ? (index === 0 ? {paddingRight: Spacing.SPACING_1} : {paddingLeft: Spacing.SPACING_1}) : null]}>
                    {loading ? _renderLoader(item) : _renderItem(item)}
                </View>
              ))}
              {item.length < columns ? emptyItems.map((item, index) => (
                  <View key={index} style={[{flex: 1}, columns > 1 ? (index === 0 ? {paddingRight: Spacing.SPACING_1} : {paddingLeft: Spacing.SPACING_1}) : null]}>
                      {loading ? _renderLoader(item) : <View/>}
                  </View>
                ))
            : null}
          </View>
        )
    }

    const _renderFooter = () => {
        if (loading === false && items.length === 0) {
            return <View style={[styles.loadMoreContainer, props.withPadding ? styles.rowPadding : null, props.footerStyle ? styles.footerStyle : null]}>
                {props.noDataComponent ? props.noDataComponent() : <Text style={styles.noDataText}>{props.noDataText ? props.noDataText : 'No data'}</Text>}
            </View>
        }
    }

    let rows = [],
      rowItems,
      i,
      j
    if (loading) {
        const loadingItems = [{},{},{},{}]
        for (i = 0, j = loadingItems.length; i < j; i += columns) {
            rowItems = loadingItems.slice(i, i + columns)
            rows.push(rowItems)
        }
    }else{
        for (i = 0, j = items.length; i < j; i += columns) {
            rowItems = items.slice(i, i + columns)
            rows.push(rowItems)
        }
    }

    return <View style={[{minHeight: scaleSize(65)}, props.paddingTop ? { paddingTop: HEADER_SPACE } : null]}>
        {rows.map((row, index) => _renderRow(row, index))}
        {_renderFooter()}
    </View>
})

ItemsGridSimple.propTypes = {
    columns: PropTypes.number,
    items: PropTypes.array,
    noDataComponent: PropTypes.any,
    noDataText: PropTypes.string,
    _renderItem: PropTypes.any,
    _renderLoader: PropTypes.any,
    withPadding: PropTypes.any,
    paddingTop: PropTypes.bool,
    loading: PropTypes.bool,
    footerStyle: PropTypes.any,
}

ItemsGridSimple.defaultProps = {
    columns: 1,
    withPadding: true,
    loading: false,
}

const styles = StyleSheet.create({
    gridRow: {
        flexDirection: 'row',
        marginBottom: Spacing.SPACING_2,
    },
    rowPadding: {
        paddingLeft: Spacing.SPACING_5,
        paddingRight: Spacing.SPACING_5,
    },
    noDataText: {
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
    },
    loadMoreContainer: {
        minHeight: scaleSize(45),
        // marginTop: Spacing.SPACING_5,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default ItemsGridSimple
