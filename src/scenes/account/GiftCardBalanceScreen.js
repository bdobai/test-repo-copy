import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import Button from '_components/atoms/Button'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_small_primary.svg'
import GiftCard from '_assets/images/gift_cards/gift_card_simple.svg'
import { scaleSize } from '../../styles/mixins'

const GiftCardsScreen = (props) => {
    const [loading, setLoading] = useState(false);

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.giftCardScreen}>
        <Header left={<BackButton color={Colors.PRIMARY}/>} style={styles.logo} center={<Logo style={ styles.logo }/>}/>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <Text style={ styles.title }>Your gift card balance</Text>
                    <Text style={ styles.amount }>100 AED</Text>
                    <GiftCard></GiftCard>
                </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={() => props.navigation.navigate('AccountSettings.GiftCardAdd')} block={true} type={'secondary'} text={"Let's order"}/>
        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    amount: {
        flex: 1,
        color: Colors.SECONDARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_40,
        lineHeight: Typography.LINE_HEIGHT_40,
        marginBottom: scaleSize(55)
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
        paddingHorizontal: Spacing.SPACING_5
    },
    giftCardScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    logo: {
        color: Colors.PRIMARY
    },
    title: {
        flex: 1,
        color: Colors.PRIMARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_22,
        lineHeight: Typography.LINE_HEIGHT_18,
        marginBottom: Spacing.SPACING_3,
    },
})

export default GiftCardsScreen
