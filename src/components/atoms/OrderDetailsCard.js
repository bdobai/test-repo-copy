import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing, Typography } from "_styles";
import { dateFormat } from "_utils/helpers";

const OrderDetailsCard = (props) => {
    const renderItems = () => {
        return props.item.items.map((item, index) => (
            <View style={styles.row} key={index}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{`AED${item.price.toFixed(2)}`}</Text>
            </View>
        ))

    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{props.item.name}</Text>
            <Text style={styles.address}>{props.item.address}</Text>
            <Text style={styles.details}>{dateFormat(props.item.date, 'MMMM DD [AT] HH:mm A')}</Text>
            <Text style={styles.details}>{`Order number: ${props.item.receipts[0].number}`}</Text>
            <View style={styles.divider}/>
            <ScrollView style={{maxHeight:'60%'}}>
                {renderItems()}
            </ScrollView>
            <View style={styles.divider}/>
            <View style={styles.row}>
                <Text style={styles.itemName}>Subtotal</Text>
                <Text style={styles.itemPrice}>{`AED${props.item.total.toFixed(2)}`}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: scaleSize(4),
        padding: Spacing.SPACING_3,
        backgroundColor: Colors.WHITE,
        width: '100%',
    },
    title: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_22,
        color: Colors.BLACK,
        fontWeight: '600'
    },
    address: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLUE_GRAY
    },
    details:{
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        color: '#909090'
    },
    divider: {
        width:'100%',
        backgroundColor: Colors.LIGHT_GREY,
        height: scaleSize(2),
        marginVertical: Spacing.SPACING_2
    },
    row:{
      flexDirection: 'row',
      justifyContent:'space-between',
      marginVertical: Spacing.SPACING_1,
    },
    itemName: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLUE_GRAY
    },
    itemPrice: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLUE_GRAY,
        fontWeight: '600',
        paddingHorizontal: Spacing.SPACING_1
    }
})

export default OrderDetailsCard
