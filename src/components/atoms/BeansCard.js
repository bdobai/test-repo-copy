import * as React from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import fullCup from '_assets/images/home/cup-full.png';
import halfCup from '_assets/images/home/cup-half.png';
import { scaleSize } from "_styles/mixins";
import ProgressBar from "_atoms/ProgressBar";

const BeansCard = (props) => {

    const percent = (props.balance * 100) / 2000;

    return (
        <View style={styles.card}>
            <Image source={props.balance >= 2000 ? fullCup : halfCup} style={styles.image}/>
            <View style={styles.contentWrapper}>
                <Text style={styles.beans}>{props.balance}<Text style={{fontSize: Typography.FONT_SIZE_16}}>/2000</Text></Text>
                <ProgressBar color={Colors.SECONDARY} percent={percent > 100 ? 100 : percent}/>
                <Text style={styles.description}>2000 beans gets you a <Text style={{fontWeight: 'bold', fontFamily: Typography.FONT_PRIMARY_BOLD}}>free coffee</Text></Text>
            </View>
        </View>
    )
}

export default BeansCard

const styles = StyleSheet.create({
    card:{
        backgroundColor: '#f4f3ef',
        paddingHorizontal: Spacing.SPACING_4,
        marginHorizontal: Spacing.SPACING_5,
        borderRadius: scaleSize(5),
        paddingTop: Spacing.SPACING_3,
        paddingBottom: Spacing.SPACING_3,
        flexDirection: 'row',
        marginBottom: Spacing.SPACING_4,
    },
    beans:{
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_36,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontWeight: 'bold'
    },
    description: {
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        paddingTop: Spacing.SPACING_3
    },
    image: {
        width: scaleSize(120),
        height: scaleSize(150),
    },
    contentWrapper:{
        flex:1,
        paddingLeft: Spacing.SPACING_3,
        paddingTop: Spacing.SPACING_2
    }
})
