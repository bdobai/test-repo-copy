import React, { useState } from 'react'
import {View, KeyboardAvoidingView, Text, StyleSheet, Pressable, ScrollView, RefreshControl } from 'react-native'
import Button from '_components/atoms/Button'
import { Colors, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'
import CreditCardCard from '_molecules/CreditCardCard'
import CreditCardCardLoader from '_components/loaders/CreditCardCardLoader'
import { useForm } from "react-hook-form";
import { request } from '_utils/request'
import ItemsGridSimple from '_organisms/ItemsGridSimple'
import CreditCardIcon from '_assets/images/account/credit-card.svg'
import DefaultCard from '_assets/images/default_card.svg'

const MyPaymentsScreen = (props) => {

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = React.useState(false)
    const [creditCards, setCreditCards] = React.useState([])
    const { control, handleSubmit, formState: { errors } } = useForm();

    // useBus(
    //   'PAYMENTS/REFRESH-LIST',
    //   (payload) => {
    //       getCreditCards()
    //   },
    //   [],
    // )

    React.useEffect(() => {
        getCreditCards();
    }, [])

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

    const onRefresh = () => {
        // setRefreshing(true)
        // getCreditCards()
    }

    const onSubmit = data => {
    };

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.paymentsScreen }>
        {/*<Header left={<BackButton/>} center={<Logo/>}/>*/}
        <Text style={styles.title}>PAYMENTS</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ styles.scrollView }
          // bounces={false}
          refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }>
            <Text style={styles.infoText}>Select your default payment method:</Text>
            <DefaultCard style={ styles.defaultCard }></DefaultCard>
            <Text style={styles.infoText}>Choose your default credit card:</Text>
            <Pressable onPress={() => props.navigation.navigate('AccountSettings.AddCreditCard')} style={styles.addNewWrapper}>
                <Text style={styles.addNewText}>+Add a new one</Text>
            </Pressable>
            <ItemsGridSimple
              rowStyle={{marginBottom: 0}}
              loading={loading}
              items={creditCards}
              noDataComponent={() => <View style={styles.noDataWrapper}>
                  <CreditCardIcon fill={Colors.WHITE} width={scaleSize(100)} height={scaleSize(100)}/>
                  <Text style={styles.noDataText}>You don't have any saved credit cards. In order to continue, please add a credit card.</Text>
              </View>}
              _renderLoader={(creditCard) => <CreditCardCardLoader creditCard={creditCard}/>}
              _renderItem={(creditCard) => <CreditCardCard creditCard={creditCard}/>}
              columns={1}
            />
            <View style={styles.footer}>
                <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Save'}/>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_3,
    },
    defaultCard: {
        marginVertical: Spacing.SPACING_5
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_5,
    },
    infoText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_LIGHT,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_13,
        marginTop: Spacing.SPACING_4,

    },
    titleText: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_24,
        lineHeight: Typography.LINE_HEIGHT_24,
    },
    titleTextSmall: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
    },
    countText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    addNewWrapper: {
        height: scaleSize(50),
        minWidth: scaleSize(70),
    },
    addNewText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_12,
        textDecorationLine: 'underline',
        marginTop: Spacing.SPACING_3,
    },
    noDataWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_6,
        paddingHorizontal: scaleSize(20)
    },
    noDataText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        marginTop: Spacing.SPACING_5,
        marginBottom: Spacing.SPACING_5,
    },
    paymentsScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    scrollView: {
        paddingHorizontal: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
        paddingBottom: Spacing.SPACING_5

    },
    title: {
        textTransform: 'uppercase',
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})


export default MyPaymentsScreen
