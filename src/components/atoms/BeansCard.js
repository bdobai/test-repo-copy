import * as React from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import fullCup from '_assets/images/home/cup-full.png';
import halfCup from '_assets/images/home/cup-half.png';
import emptyCup from '_assets/images/home/cup-empty.png';
import { scaleSize } from "_styles/mixins";
import ProgressBar from "_atoms/ProgressBar";

const BeansCard = (props) => {

    const percent = (props.balance * 100) / 2000;

    const renderTier = () => {
        if(!props.tier || props.tier !== 'Family Discount') return;
        return (
            <Text style={styles.tier}>{`Tier: Family Discount`}</Text>
        )
    }

    return (
        <View style={styles.card}>
            <Image key={props.balance} source={props.balance >= 2000 ? fullCup : (props.balance > 0 ? halfCup : emptyCup)} style={styles.image} resizeMode={'contain'}/>
            <View style={styles.contentWrapper}>
                <Text style={styles.beans}>{props.balance}</Text>
                <ProgressBar color={Colors.SECONDARY} percent={percent > 100 ? 100 : percent}/>
                <Text style={styles.description}>2000 beans gets you a <Text style={{fontWeight: 'bold', fontFamily: Typography.FONT_PRIMARY_BOLD}}>free coffee</Text></Text>
                {renderTier()}
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
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    description: {
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        paddingTop: Spacing.SPACING_3
    },
    image: {
        width: scaleSize(80),
        height: scaleSize(100),
    },
    contentWrapper:{
        flex:1,
        paddingLeft: Spacing.SPACING_3,
        paddingTop: Spacing.SPACING_2
    },
    tier: {
        color: Colors.SECONDARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_16,
        paddingTop: Spacing.SPACING_2
    }
})
