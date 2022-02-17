import { Text, View, StyleSheet } from "react-native";
import { scaleSize } from "_styles/mixins";
import { Spacing, Typography } from "_styles";
import React from 'react'

const OrderInfo = (props) => {
    const reward = props.item.rewards[0]
    if(reward && reward?.earned!==0) {
        return (
            <View style={styles.row}>
                <Text style={styles.text}>{`${reward.earned} Beans earned`}</Text>
                <View style={styles.earnedBox}>
                    <Text style={[styles.text, styles.earnedText]}>{`+${reward?.earned}`}</Text>
                </View>
            </View>
        )
    } else if(reward && reward?.spent!==0){
        return (
            <View style={styles.row}>
                <Text style={styles.text}>{`${reward.spent} Beans redeemed`}</Text>
                <View style={styles.redeemedBox}>
                    <Text style={[styles.text, styles.redeemedText]}>{`-${reward?.spent}`}</Text>
                </View>
            </View>
        )
    } else if(props.item.quickpay.loaded!==0){
        return (
            <View>
                <View style={styles.row}>
                    <Text style={styles.text}>Account reload</Text>
                    <View style={styles.earnedBox}>
                        <Text style={[styles.text, styles.earnedText]}>{`+AED${props.item.quickpay.loaded.toFixed(2)}`}</Text>
                    </View>
                </View>
                <View style={[styles.row, {paddingTop:0}]}>
                    <Text style={[styles.text, styles.balance]}>{`Balance remaining`}</Text>
                    <Text style={[styles.text, styles.balance]}>{`AED${props.item.quickpay.balance.toFixed(2)}`}</Text>
                </View>
            </View>
        )
    } else if (props.item.quickpay.used!==0) {
        return (
            <View>
                <View style={styles.row}>
                    <Text style={styles.text}>Account balance spent</Text>
                    <View style={styles.redeemedBox}>
                        <Text style={[styles.text, styles.redeemedText]}>{`-AED${props.item.quickpay.used.toFixed(2)}`}</Text>
                    </View>
                </View>
                <View style={[styles.row, {paddingTop:0}]}>
                    <Text style={[styles.text, styles.balance]}>{`Balance remaining`}</Text>
                    <Text style={[styles.text, styles.balance]}>{`AED${props.item.quickpay.balance.toFixed(2)}`}</Text>
                </View>
            </View>
        )
    }
    return <View/>
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingTop: Spacing.SPACING_2,
        paddingBottom: Spacing.SPACING_2
    },
    text:{
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
    },
    earnedBox: {
        backgroundColor: '#ddffcf',
        borderRadius: scaleSize(4),
        justifyContent: 'center',
        alignItems:'center'
    },
    earnedText: {
        color: '#00AD50',
        paddingVertical: scaleSize(5),
        paddingHorizontal: scaleSize(10),
        fontWeight: '600'
    },
    redeemedBox: {
        backgroundColor: '#f9afaf',
        borderRadius: scaleSize(4),
        justifyContent: 'center',
        alignItems:'center',
    },
    redeemedText: {
        color: '#BD0000',
        paddingVertical: scaleSize(5),
        paddingHorizontal: scaleSize(10),
        fontWeight: '600'
    },
    balance: {
        color: '#909090',
        maxWidth: '70%'
    }
})

export default OrderInfo
