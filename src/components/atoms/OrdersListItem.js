import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { scaleSize } from "_styles/mixins";
import RightChevron from "_assets/images/right-chevron.svg";
import { dateFormat } from "_utils/helpers";
import OrderInfo from "_atoms/OrderInfo";
import ratingIcon from '_assets/images/orders/rating.png';

const OrdersListItem = (props) => {

    const onMore = () => {
        props.onMore(props.item);
    }

    const renderFeedback = () => {
        if(props.item.rating.value > 0) {
            return <Text style={[styles.text, styles.feedback]}>{'Rating: ' + (props.item.rating.value / 20).toFixed(1)}</Text>
        }
        return <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image source={ratingIcon} style={styles.ratingIcon} resizeMode={'contain'}/>
            <Text style={[styles.text, styles.feedback]}>Rate</Text>
        </View>
    }

    const onFeedback = () => {
        if(props.item.rating.value > 0) return;
        return props.onFeedback(props.item);
    }

    const renderMore = () => {
        if(props.item.total === 0) return;
        return (
            <View>
                <View style={styles.row}>
                    <Pressable onPress={onFeedback} style={styles.feedbackButton}>
                        {renderFeedback()}
                    </Pressable>
                    <Pressable onPress={onMore} style={styles.button}>
                        <Text style={[styles.text, styles.more]}>More</Text>
                        <RightChevron width={scaleSize(12)} height={scaleSize(12)} fill={Colors.BLUE_GRAY}/>
                    </Pressable>
                </View>
            </View>
        )
    }

    const getTitle = () => {
        const reward = props.item.rewards[0];
        if(reward && reward?.earned!==0){
            return { title: "Purchase", price: props.item.total.toFixed(2)}
        }else if(reward && reward?.spent!==0){
            return { title: "Redeemed Beans", price: `-${reward?.spent}` }
        }else if(props.item.quickpay.loaded!==0)  {
            return { title: "Reload", price: `+AED${props.item.quickpay.loaded.toFixed(2)}` }
        }else if(props.item.quickpay.used!==0) {
            return {title: 'Spent', price: `AED${props.item.quickpay.balance.toFixed(2)}`}
        }
    }

    const renderTitle = () => {
        console.debug('props.item', props.item);
        // if(props.item.total === 0) return;
        return <View style={[styles.row, {paddingVertical: scaleSize(10)}]}>
            <View style={{flex:1}}>
                <Text style={styles.title}>{getTitle().title}</Text>
                <Text style={styles.name}>{`${props.item.name}`}</Text>
            </View>
            <Text style={styles.title}>{getTitle().price}</Text>
        </View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{dateFormat(props.item.date, 'MMMM DD [(]ddd[)] [-] HH:mm')}</Text>
            {renderTitle()}
            <OrderInfo item={props.item} hideDetails={true}/>
            {renderMore()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: scaleSize(10),
        paddingBottom: 0
    },
    date: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_16,
        color: '#909090',
        paddingBottom: scaleSize(10)
    },
    divider: {
        width:'100%',
        backgroundColor: Colors.LIGHT_GREY,
        height: 1,
    },
    title: {
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
    },
    name: {
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
    },
    text:{
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleSize(10)
    },
    more: {
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        paddingRight: Spacing.SPACING_1/2
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    feedbackButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: scaleSize(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: Spacing.SPACING_1
    },
    feedback: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        padding: Spacing.SPACING_2,
    },
    ratingIcon: {
        width: scaleSize(20),
        height: scaleSize(20),
        marginLeft: scaleSize(10)
    }
})

export default OrdersListItem
