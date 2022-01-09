import * as React from 'react';
import { Text, StyleSheet, Pressable, View, Image } from "react-native";
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing, Typography } from "_styles";
import costCard from "_assets/images/account/costa-card-orange.png";
import { useState } from "react";
import { cardFormat } from "_utils/helpers";

const GiftCard = (props) => {
    const inactive = props.card.status.name === 'Inactive'
    const [editMode, setEditMode] = useState(false);

    const onLost = () => {
        props.onLost(props.card)
        setEditMode(false)
    }

    const onDelete = () => {
        props.onDelete(props.card)
    }

    const onActivate = () => {
        props.onActivate(props.card)
        setEditMode(false)
    }

    const renderFirstOption = () => {
        if(!inactive) {
            return (
                <Pressable onPress={onLost}>
                    <Text style={styles.option}>Lost</Text>
                </Pressable>
            )
        }
        return (
            <Pressable onPress={onActivate}>
                <Text style={styles.option}>Activate</Text>
            </Pressable>
        )
    }

    const renderOptions = () => {
        if(!editMode) return;
        return (
            <View style={styles.optionsWrapper}>
                {renderFirstOption()}
                <Pressable onPress={onDelete}>
                    <Text style={styles.option}>Delete</Text>
                </Pressable>
            </View>
        )
    }

    const renderLostMessage = () => {
        if(!props.isLost) return;
        return <Text style={styles.lost}>Your card has successfully been marked as lost. If you find it you can reactivate it here</Text>
    }

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.cardDetails}>
                    <Image style={styles.cardIcon} source={costCard}/>
                    <Text style={[styles.number, inactive ? {color: '#d3d3d3'} : {}]}>{cardFormat(props.card.card.number)}</Text>
                </View>
                <Pressable onPress={() =>setEditMode(!editMode)}>
                    <Text style={[styles.edit, inactive ? {color: '#d3d3d3'} : {}]}>{editMode ? 'Close' : inactive ? 'Lost' : 'Edit'}</Text>
                </Pressable>
            </View>
            {renderOptions()}
            {renderLostMessage()}
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
    },
    lost: {
        color: '#d3d3d3',
        fontSize: Typography.FONT_SIZE_12,
        alignSelf:'center',
        textAlign:'center',
        marginBottom: Spacing.SPACING_2
    }
})

export default GiftCard
