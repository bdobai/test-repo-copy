import * as React from 'react';
import { Text, StyleSheet, Pressable, View, Image } from "react-native";
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing } from "_styles";
import costCard from "_assets/images/account/costa-card-orange.png";
import { useState } from "react";
import { cardFormat } from "_utils/helpers";

const GiftCard = (props) => {

    const [editMode, setEditMode] = useState(false);

    const onLost = () => {
        props.onLost(props.card)
    }

    const onDelete = () => {
        props.onDelete(props.card)
    }

    const renderOptions = () => {
        if(!editMode) return;
        return (
            <View style={styles.optionsWrapper}>
                <Pressable onPress={onLost}>
                    <Text style={styles.option}>Lost</Text>
                </Pressable>
                <Pressable onPress={onDelete}>
                    <Text style={styles.option}>Delete</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.cardDetails}>
                    <Image style={styles.cardIcon} source={costCard}/>
                    <Text style={styles.number}>{cardFormat(props.card.number)}</Text>
                </View>
                <Pressable onPress={() =>setEditMode(!editMode)}>
                    <Text style={styles.edit}>Edit</Text>
                </Pressable>
            </View>
            {renderOptions()}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width:'90%',
        minHeight: scaleSize(92),
        borderWidth:1,
        borderColor: '#ccc',
        paddingHorizontal: Spacing.SPACING_5,
        justifyContent: 'center',
        marginBottom: Spacing.SPACING_5
    },
    content:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    number: {
        color: Colors.BLUE_GRAY,
        marginLeft: Spacing.SPACING_1
    },
    edit: {
        color: Colors.BLUE_GRAY
    },
    cardDetails: {
      flexDirection: 'row',
      alignItems:'center'
    },
    cardIcon: {
        width: scaleSize(44),
        height: scaleSize(44),
    },
    optionsWrapper: {
        width: '100%',
        justifyContent:'center',
        alignItems:'center'
    },
    option:{
        color: Colors.BLUE_GRAY,
        padding: Spacing.SPACING_2
    }
})

export default GiftCard
