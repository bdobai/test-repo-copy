import React, { useEffect, useState, useImperativeHandle, useRef } from 'react'
import { FlatList, StyleSheet, Text, View, } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '_styles'
import Spinner from '_atoms/Spinner'
import { request } from '_utils/request'
import { scaleSize } from '_styles/mixins'
import { compare } from '_utils/helpers'
import { AuthStoreContext } from '_stores'
import { HEADER_SPACE } from '_styles/spacing'

const ItemsGrid = React.forwardRef((props, ref) => {
    const authStore = React.useContext(AuthStoreContext);

    const {
        ListHeaderComponent,
        columns,
        _renderItem,
        _renderLoader,
    } = props

    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(null);
    const [pageToken, setPageToken] = useState(0);

    const [items, setItems] = useState([])
    const filtersRef = useRef();

    useImperativeHandle(ref, () => ({
        refreshData () {
            setLoading(true)
            getData(props.filters, 1);
        }
    }));

    const _renderRow = ({ item, index }) => {
        let emptyItems = [];
        for (let i = 0; i < columns - item.length; i++){
            emptyItems.push('')
        }
        return (
          <View key={index} style={[styles.gridRow, props.withPadding ? styles.rowPadding : null, props.rowStyle ? props.rowStyle : null]}>
              {item.map((item, rowIndex) => (
                <View key={rowIndex} style={[{flex: 1}, columns > 1 ? (rowIndex === 0 ? {paddingRight: Spacing.SPACING_1} : {paddingLeft: Spacing.SPACING_1}) : null]}>
                    {loading ? _renderLoader(item, index, rowIndex) : _renderItem(item, index, rowIndex)}
                </View>
              ))}
              {item.length < columns ? emptyItems.map((item, rowIndex) => (
                  <View key={rowIndex} style={[{flex: 1}, columns > 1 ? (rowIndex === 0 ? {paddingRight: Spacing.SPACING_1} : {paddingLeft: Spacing.SPACING_1}) : null]}>
                      {loading ? _renderLoader(item) : <View/>}
                  </View>
                ))
            : null}
          </View>
        )
    }

    // const getDataDebounce = useCallback(
    //   _.debounce((filters, page) => getData(filters, page), 1000),
    //   []
    // );

    const getDataDebounce = (filters, page) => getData(filters, page);

    const getData = (filters, page, page_token) => {
        if (!props.url) {
            return;
        }
        let request_filters = filters
        if(props.paginationType === 'classic'){
            request_filters =  {...filters, ...{page: page}}
        }else if(props.paginationType === 'infinite'){
            if (page_token === null) {
                return
            }
            request_filters =  {...filters, ...{page_token: page_token}}
        }

        request(props.url, {
            data: request_filters,
            method: props.method ? props.method : 'GET',
            success: function (res) {

                if(props.paginationType === 'classic'){
                    setCurrentPage(res.data.current_page);
                    setLastPage(res.data.last_page);
                    if (page === 1) {
                        setItems(res.data.data);
                    }else {
                        setItems([...items, ...res.data.data]);
                    }
                    if (props.onSetTotal) {
                        props.onSetTotal(res.data.total)
                    }
                }else if(props.paginationType === 'infinite'){
                    setPageToken(res.page_token);
                    if (page_token === 0) {
                        setItems(res.data);
                    }else {
                        setItems([...items, ...res.data]);
                    }
                }
                if (typeof res.notifications_count !== 'undefined') {
                    authStore.setNotificationsCount(res.notifications_count)
                }
                setRefreshing(false)
                setLoading(false)
                setLoadingMore(false);
            },
            error: function (error) {
                setRefreshing(false)
                setLoading(false)
                setLoadingMore(false);
            },
        })
    }

    const loadMore = () => {
        if (loading === true || loadingMore === true) {
            return false;
        }
        if(props.paginationType === 'classic' && lastPage <= currentPage){
            return false;
        }else if (props.paginationType === 'infinite' && !pageToken) {
            return false;
        }
        setLoadingMore(true);
        getData(props.filters, currentPage + 1, pageToken);
    }

    useEffect(() => {
        if(!compare(filtersRef.current, props.filters)){
            setLoading(true)
            filtersRef.current = props.filters
            getData(props.filters, 1, 0)
        }
    }, [props.filters])

    const onRefresh = () => {
        setRefreshing(true)
        setPageToken(0)
        getData(props.filters, 1, 0)
    }

    const _renderFooter = () => {
        if (loadingMore === false && loading === false && items.length === 0) {
            return <View style={styles.loadMoreContainer}>
                {props.noDataComponent ? props.noDataComponent() : <Text style={styles.noDataText}>{props.noDataText ? props.noDataText : 'No data'}</Text>}
            </View>
        }
        if (loadingMore === false) {
            return null
        }
        return (
          <View style={styles.loadMoreContainer}>
              <Spinner visible={true}/>
          </View>
        )
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

    return (
      <FlatList
        bounces={props.bounces}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'never'}
        ListHeaderComponent={
            ListHeaderComponent ? ListHeaderComponent : null
        }
        renderItem={_renderRow}
        keyExtractor={(item, index) => 'row-' + index}
        data={rows}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadMore()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListFooterComponent={_renderFooter}
        ListFooterComponentStyle={styles.ListFooterComponentStyle}
        contentContainerStyle={[styles.contentContainerStyle, props.paddingTop ? {paddingTop: HEADER_SPACE} : null, props.contentContainerStyle ? props.contentContainerStyle : null]}
      />
    )
})

ItemsGrid.propTypes = {
    ListHeaderComponent: PropTypes.any,
    columns: PropTypes.number,
    url: PropTypes.string,
    noDataComponent: PropTypes.any,
    noDataText: PropTypes.string,
    filters: PropTypes.any,
    _renderItem: PropTypes.any,
    _renderLoader: PropTypes.any,
    withPadding: PropTypes.any,
    paddingTop: PropTypes.bool,
    onSetTotal: PropTypes.any,
    paginationType: PropTypes.string,
}

ItemsGrid.defaultProps = {
    columns: 1,
    url: null,
    filters: {},
    withPadding: true,
    paginationType: 'classic',
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
    loadMoreContainer: {
        minHeight: scaleSize(220),
        marginTop: Spacing.SPACING_5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ListFooterComponentStyle: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: scaleSize(45)
    },
    noDataText: {
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
    }
})

export default ItemsGrid
