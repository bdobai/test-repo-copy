import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl } from 'react-native'
import Header from '_components/molecules/Header'
import PageTitle from '_atoms/PageTitle'
import BackButton from '_atoms/BackButton'
import IconPlaceholder from '_atoms/IconPlaceholder'
import ListTitle from '_atoms/ListTitle'
import Container from '_atoms/Container'
import { Colors, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'
import CreditCardCard from '_molecules/CreditCardCard'
import CreditCardCardLoader from '_components/loaders/CreditCardCardLoader'
import useBus from 'use-bus'
import { request } from '_utils/request'
import ItemsGridSimple from '_organisms/ItemsGridSimple'
import CreditCardIcon from '_assets/images/account/credit-card.svg'
import { HEADER_SPACE } from '_styles/spacing'

const MyPaymentsScreen = (props) => {

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = React.useState(false)
    const [creditCards, setCreditCards] = React.useState([])

    useBus(
      'PAYMENTS/REFRESH-LIST',
      (payload) => {
          getCreditCards()
      },
      [],
    )

    React.useEffect(() => {
        getCreditCards();
    }, [])

    const getCreditCards = () => {
        setLoading(true)
        request('/payments/credit-cards', {
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
        setRefreshing(true)
        getCreditCards()
    }

    return<View style={{ flex: 1 }}>
        <Header
          left={<BackButton/>}
          center={<PageTitle size={'small'} title={'Payment'}/>}
          right={<IconPlaceholder/>}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingTop: HEADER_SPACE}}
          // bounces={false}
          refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }>
            <Container>
                <ListTitle size={'small'}
                           title={'Your credit cards'}
                           action={() => <Pressable onPress={() => props.navigation.navigate('AccountSettings.AddCreditCard')} style={styles.addNewWrapper}>
                               <Text style={styles.addNewText}>+ Add new</Text>
                           </Pressable>}
                />
            </Container>
            <ItemsGridSimple
              rowStyle={{marginBottom: 0}}
              loading={loading}
              items={creditCards}
              noDataComponent={() => <View style={styles.noDataWrapper}>
                  <CreditCardIcon fill={Colors.GRAY_DARK + '70'} width={scaleSize(100)} height={scaleSize(100)}/>
                  <Text style={styles.noDataText}>You don't have any saved credit cards. In order to continue, please add a credit card.</Text>
              </View>}
              _renderLoader={(creditCard) => <CreditCardCardLoader creditCard={creditCard}/>}
              _renderItem={(creditCard) => <CreditCardCard creditCard={creditCard}/>}
              columns={1}
            />
        </ScrollView>
    </View>
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_3
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
        height: scaleSize(30),
        minWidth: scaleSize(70),
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    addNewText: {
        textAlign: 'right',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    noDataWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_7,
        paddingHorizontal: scaleSize(20)
    },
    noDataText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        marginTop: Spacing.SPACING_5,
        marginBottom: Spacing.SPACING_5
    },
})


export default MyPaymentsScreen
