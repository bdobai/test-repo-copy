import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { request } from "_utils/request";
import Spinner from "_atoms/Spinner";
import { Colors, Spacing, Typography } from "_styles";
import OrdersListItem from "_atoms/OrdersListItem";
import Button from "_atoms/Button";
import { scaleSize, SCREEN_HEIGHT } from "_styles/mixins";
import ActionSheet from "react-native-actions-sheet";
import OrderInfo from "_atoms/OrderInfo";
import OrderDetailsCard from "_atoms/OrderDetailsCard";
import ArrowDown from "_assets/images/orders/arrow-down-orange.png"
import { isIphone } from "_utils/helpers";
import FeedbackSection from "_atoms/FeedbackSection";
import Modal from "react-native-modal";
import CloseIcon from "_assets/images/close.svg";
import { visilabsApi } from "_utils/analytics";

const HistoryScreen = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const actionSheetRef = useRef();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            visilabsApi.customEvent('Order-History');
            StatusBar.setBarStyle('dark-content')
            if(!isIphone()){
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(Colors.WHITE);
            }
        });

        return unsubscribe;
    }, [props.navigation]);

    const getData = (refresh) => {
        const body = {
            "order": 'dateCreated(desc)',
            "limit": '5'
        }
        if(page!==0){
            body.page = !refresh ? page+1 : 1;
        }
        request('/user/transaction/list.json', {
            method: 'GET',
            data: body,
            withToken: true,
            success: function (response) {
                setTotalPages(response.total_pages);
                setData((page === 0 || refresh) ? response.data : [...data, ...response.data]);
                setPage(page+1)
                setLoading(false)
                setRefreshing(false)
                setLoadingMore(false)
            },
            error: (e) => {
                console.log('e',e);
                setLoading(false)
            }
        });
    }

    useEffect(() => {
        getData()
    }, [])

    const onRefresh = () => {
        setPage(0);
        setRefreshing(true)
        getData(true)
    }

    const loadMore = () => {
        setLoadingMore(true);
        getData();
    }

    const onMore = (item) => {
        setOrder(item);
        actionSheetRef.current.setModalVisible(true);
    }

    const onFeedback = (item) => {
        setOrder(item);
        setModalVisible(true);
    }

    const renderItem = ({ item }) => {
        return <OrdersListItem onMore={onMore} onFeedback={onFeedback} item={item}/>
    }

    const renderListEmptyComponent = () => {
        if(loading)
            return <Spinner color={Colors.PRIMARY}/>
        return <View style={{alignSelf: 'center'}}><Text style={styles.title}>No orders yet</Text></View>
    }

    const renderItemSeparator = () => {
        return <View style={styles.divider}/>
    }

    const renderListFooterComponent = () => {
        if(!data.length || totalPages <= page ) return <View/>
        return (
            <Button text={'LOAD MORE'} onPress={loadMore} square={true} block={true} type={'primary'} loading={loadingMore}/>
        )
    }

    const filteredData = data.filter((item) => item.status === 'Complete')

    const renderOrderDetails = () => {
        if(!order) return;
        return(
            <View style={{height:'100%'}}>
                <Pressable onPress={() => actionSheetRef.current.setModalVisible(false)} style={styles.arrowWrapper}>
                    <Image resizeMode={'stretch'} source={ArrowDown} style={styles.arrow}/>
                </Pressable>
                <View style={{paddingHorizontal: Spacing.SPACING_4}}>
                    <Text style={styles.title}>{`AED${order?.total.toFixed(2)} purchase at ${order?.name}`}</Text>
                    <OrderInfo item={order}/>
                </View>
                <View style={styles.cardWrapper}>
                    <OrderDetailsCard item={order}/>
                </View>
            </View>
        )
    }

    const onSendFeedback = (stars, comment) => {
        setLoadingFeedback(true)
        request('/user/transaction/rate.json', {
            method: 'POST',
            data: {
                comment: comment,
                rating: stars * 20,
                transaction: order.id
            },
            withToken: true,
            withoutJson: true,
            success: function (response) {
                const index = data.findIndex((item) => item.id === order.id);
                data[index] = {...data[index], rating: {value: stars*20, comment: comment}}
                setData([...data]);
                setLoadingFeedback(false)
                setModalVisible(false);
            },
            error: (e) => {
                setLoadingFeedback(false)
            }
        });
    }

    return (
        <View style={styles.container}>
            <SafeAreaView/>
            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => 'row-' + index}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderListEmptyComponent}
                ItemSeparatorComponent={renderItemSeparator}
                contentContainerStyle={[
                    styles.contentContainer,
                    !data.length ? {height:'100%'} : {},
                ]}
                style={{height:'100%'}}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListFooterComponent={renderListFooterComponent}
                ListFooterComponentStyle={{
                    marginTop: Spacing.SPACING_3,
                    marginBottom: Spacing.SPACING_5
                }}
            />
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                backdropColor={Colors.BLACK}
                backdropOpacity={0.2}
            >
                <Pressable style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose} hitSlop={{top: scaleSize(10), bottom: scaleSize(10), left:scaleSize(10), right: scaleSize(10)}}>
                            <CloseIcon width={scaleSize(12)} height={scaleSize(12)} fill={Colors.BLACK}/>
                        </Pressable>
                        <OrderDetailsCard item={order}/>
                        <FeedbackSection onSendFeedback={onSendFeedback} loading={loadingFeedback}/>
                    </View>
                </Pressable>
            </Modal>
            <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetRef} safeAreaInnerHeight={0}>
                {renderOrderDetails()}
            </ActionSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.SPACING_4
    },
    divider: {
        width:'100%',
        backgroundColor: Colors.LIGHT_GREY,
        height: 1,
        marginBottom: Spacing.SPACING_4,
    },
    contentContainer: {
        paddingBottom: scaleSize(60),
        justifyContent: 'center',
    },
    title: {
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        paddingVertical: scaleSize(10)
    },
    actionSheet: {
        borderRadius: 0,
        height: SCREEN_HEIGHT*0.8,
        borderTopWidth:1,
        borderColor: Colors.BLUE_GRAY,
        marginBottom:0,
        paddingBottom:0,
    },
    cardWrapper: {
        backgroundColor: '#f1f1f1',
        flex:1,
        alignItems: 'center',
        paddingTop: Spacing.SPACING_5,
        paddingHorizontal: Spacing.SPACING_5
    },
    arrow: {
        width: scaleSize(40),
        height: scaleSize(40),
    },
    arrowWrapper: {
        width: scaleSize(36),
        height: scaleSize(36),
        borderRadius: scaleSize(18),
        backgroundColor: '#f1f1f1',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: Spacing.SPACING_4,
        marginBottom: Spacing.SPACING_2
    },
    centeredView: {
        justifyContent: "center",
    },
    modalView: {
        marginVertical: scaleSize(20),
        backgroundColor: "white",
        borderRadius: scaleSize(20),
        padding: scaleSize(35),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalClose: {
        position: 'absolute',
        right: 20,
        top: 20
    }
})

export default HistoryScreen
