import * as React from 'react';
import { View, StyleSheet, Text, FlatList, Alert } from "react-native";
import { request } from "_utils/request";
import { useCallback, useState } from "react";
import CreditCardListItem from "_atoms/CreditCardListItem";
import Radio from "_atoms/Radio";
import { Colors, Spacing, Typography } from "_styles";
import Spinner from "_atoms/Spinner";
import { useFocusEffect } from "@react-navigation/native";

const CreditCardsScreen = (props) => {
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = React.useState(false)
    const [creditCards, setCreditCards] = React.useState([])

    useFocusEffect(
        useCallback(() => {
            getCreditCards();
        }, [props.navigation])
    );

    // React.useEffect(() => {
    //     getCreditCards();
    // }, [])

    const getCreditCards = () => {
        setLoading(true)
        request('/user/billing-profile/list.json', {
            method: 'GET',
            success: function (res) {
                setLoading(false)
                setRefreshing(false)
                setCreditCards(res.data)
            },
            error: function (error) {
                setLoading(false)
                setRefreshing(false)
            },
        })
    }

    const onAddCreditCard = () => {
        props.navigation.navigate('AccountSettings.AddCreditCard')
    }

    const renderListFooter = () => {
        return <Radio onChange={onAddCreditCard} label={'New credit card'} labelStyle={styles.newCreditCard} selectedValue={true} value={false}/>
    }

    const onPress = (creditCard) => {
        return;
    }

    const removeCard = (id: number) => {
        let filteredCards = [...creditCards];
        filteredCards = filteredCards.filter((item) => item.id !==id);
        setCreditCards([...filteredCards])
    }

    const onPressDelete = (creditCard) => {
        Alert.alert('', 'Are you sure you want to delete this credit card ?', [
            {
                text: 'Yes',
                onPress: () => {
                    request('/user/billing-profile', {
                        data: { 'user_billingprofile': creditCard.id },
                        method: 'DELETE',
                        withoutJson: true,
                        success: function (res) {
                            removeCard(creditCard.id)
                        },
                        error: function (){},
                    })
                }
            },
            {
                text: 'Cancel',
                style: 'cancel'
            },
        ])
    }

    const renderItem = ({item}) => {
        return <CreditCardListItem item={item} onPress={onPress} onPressDelete={onPressDelete} selected={true}/>
    }

    const renderListEmpty = () => {
        if(!loading) return <View/>
        return <View style={styles.loadingContainer}>
            <Spinner/>
        </View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select your default payment</Text>
            <FlatList
                renderItem={renderItem}
                data={creditCards}
                ListFooterComponent={renderListFooter}
                ListEmptyComponent={renderListEmpty}
                contentContainerStyle={[styles.contentContainer, loading ? {height:'100%'} : {}]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        flex:1,
        paddingHorizontal: Spacing.SPACING_5
    },
    title: {
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        color: Colors.PRIMARY,
        alignSelf: 'center',
        marginTop: Spacing.SPACING_7,
        marginBottom: Spacing.SPACING_8
    },
    newCreditCard: {
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLACK
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingBottom: Spacing.SPACING_10
    }
})

export default CreditCardsScreen
