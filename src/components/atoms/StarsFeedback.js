import * as React from 'react';
import { View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import Star from '_assets/images/history/star.svg'
import StarOutline from '_assets/images/history/star-outline.svg'
import { Colors, Spacing } from "_styles";
import { scaleSize } from "_styles/mixins";

const STARS = [1,2,3,4,5]

const StarsFeedback = (props) => {
    const [selectedStar, setSelectedStar] = useState(0);

    const renderStar = (item) => {
        if(item <= selectedStar){
            return <Star fill={Colors.PRIMARY} width={scaleSize(24)} height={scaleSize(24)} style={styles.icon}/>
        }
        return <StarOutline fill={Colors.PRIMARY} width={scaleSize(24)} height={scaleSize(24)} style={styles.icon}/>
    }

    const renderStars = () => STARS.map((item) => (
        <Pressable onPress={() => setSelectedStar(item)}>
            {renderStar(item)}
        </Pressable>
    ))

    return (
        <View style={styles.container}>
            {renderStars()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: Spacing.SPACING_2,
    },
    icon: {
        marginHorizontal: Spacing.SPACING_1/2
    }
})

export default StarsFeedback
