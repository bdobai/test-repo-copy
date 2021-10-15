import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import Button from '_components/atoms/Button'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_small_primary.svg'
import GiftCard from '_assets/images/gift_cards/gift.svg'
import { scaleSize } from '../../styles/mixins'

const GiftScreen = (props) => {
    const [loading, setLoading] = useState(false);

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.giftCardScreen}>
        {/*<Header left={<BackButton color={Colors.PRIMARY}/>} center={<Logo/>}/>*/}
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <GiftCard></GiftCard>
                    <Text style={ styles.amount }>1000</Text>
                    <Text style={ styles.title }>We have got a birthday gift for you!</Text>
                </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={() => props.navigation.navigate('#')} block={true} type={'secondary'} text={"Choose your gift"}/>
        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    amount: {
        color: Colors.PRIMARY,
        fontFamily: Typography.FONT_SECONDARY_REGULAR, //need to update font
        fontSize: scaleSize(65),
        position: 'absolute',
        top: scaleSize(100),
        left: scaleSize(160)
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        alignItems: 'center',
        marginBottom: Spacing.SPACING_4,
        paddingHorizontal: Spacing.SPACING_5
    },
    giftCardScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    title: {
        flex: 1,
        color: Colors.PRIMARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_22,
        lineHeight: Typography.LINE_HEIGHT_18,
        marginBottom: scaleSize(26),
        marginTop: scaleSize(50),
        textAlign: 'center',
    },
})

export default GiftScreen
