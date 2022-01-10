import * as React from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import coffeeCup from '_assets/images/home/cup-red.png';
import { scaleSize } from "_styles/mixins";

const BeansCard = (props) => {
    return (
        <View style={styles.card}>
            <View style={styles.beansWrapper}>
                <Image source={coffeeCup} style={styles.image}/>
                <View>
                    <Text style={styles.beans}>{props.balance}</Text>
                    <Text style={styles.timeForFree}>Time for a free coffee!</Text>
                </View>
            </View>
            <Text style={styles.description}>2000 beans gets you a free coffee</Text>
        </View>
    )
}

export default BeansCard

const styles = StyleSheet.create({
    card:{
        backgroundColor: '#f4f3ef',
        paddingHorizontal: Spacing.SPACING_4,
        marginHorizontal: Spacing.SPACING_7,
        borderRadius: scaleSize(5),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
        paddingTop: Spacing.SPACING_5,
        paddingBottom: Spacing.SPACING_3,
    },
    beansWrapper: {
        flexDirection: 'row',
        paddingBottom: Spacing.SPACING_2
    },
    beans:{
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_40,
        fontFamily: Typography.FONT_SECONDARY_BOLD
    },
    description: {
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        alignSelf: "center",
    },
    timeForFree: {
        color: '#87744a',
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
    },
    image: {
        width: scaleSize(100),
        height: scaleSize(100),
    }
})
