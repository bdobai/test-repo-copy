import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { scaleSize } from "_styles/mixins";
import RightChevron from "_assets/images/right-chevron.svg";
import { dateFormat } from "_utils/helpers";
import OrderInfo from "_atoms/OrderInfo";

const OrdersListItem = (props) => {

    const onMore = () => props.onMore(props.item);

    const renderMore = () => {
        if(props.item.total === 0) return;
        return (
            <View>
                <View style={styles.divider}/>
                <Pressable onPress={onMore} style={styles.button}>
                    <Text style={[styles.text, styles.more]}>More</Text>
                    <RightChevron width={scaleSize(12)} height={scaleSize(12)} fill={Colors.BLUE_GRAY}/>
                </Pressable>
            </View>
        )
    }

    const renderTitle = () => {
        if(props.item.total === 0) return;
        return <Text style={styles.title}>{`AED${props.item.total.toFixed(2)} purchase at ${props.item.name}`}</Text>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{dateFormat(props.item.date, 'MMMM DD [AT] HH:mm A')}</Text>
            <View style={styles.divider}/>
            {renderTitle()}
            <OrderInfo item={props.item}/>
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
        textTransform: 'uppercase',
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
        paddingVertical: scaleSize(10)
    },
    text:{
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
    },
    button: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleSize(10)
    },
    more: {
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        paddingRight: Spacing.SPACING_1/2
    },
})

export default OrdersListItem
