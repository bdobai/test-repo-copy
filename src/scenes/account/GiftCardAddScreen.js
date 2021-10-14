import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import Button from '_components/atoms/Button'
import { request } from '_utils/request'
import { useForm, Controller } from "react-hook-form";
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_small_primary.svg'
import GiftCard from '_assets/images/gift_cards/gift_card_complex.svg'
import { scaleSize } from '../../styles/mixins'
import Input from '../../components/atoms/Input'

const GiftCardAddScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm();
    const numberRef = React.useRef()
    const pinRef = React.useRef()

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.giftCardScreen}>
        <Header left={<BackButton color={Colors.PRIMARY}/>} center={<Logo/>}/>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <GiftCard></GiftCard>
                    <Text style={ styles.title }>It seems you have a gift card</Text>
                    <View style={ styles.inputs }>
                        <Controller
                            control={control}
                            onFocus={() => {numberRef.current.focus()}}
                            render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                onSubmitEditing={() => pinRef.current.focus()}
                                ref={numberRef}
                                error={errors.number?.message}
                                containerStyle={{ marginBottom: Spacing.SPACING_3 }}
                                label="Please enter gift card number"
                                />
                            )}
                            name="number"
                            rules={{ required: 'Number is required'}}
                            defaultValue={''}
                        />
                        <Controller
                            control={control}
                            onFocus={() => {pinRef.current.focus()}}
                            render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                onSubmitEditing={() => handleSubmit(onSubmit)}
                                ref={pinRef}
                                secureTextEntry={true}
                                error={errors.pin?.message}
                                containerStyle={{ marginBottom: Spacing.SPACING_3 }}
                                label="PIN"
                                />
                            )}
                            name="pin"
                            rules={{ required: 'PIN is required'}}
                            defaultValue={''}
                        />
                    </View>
                </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={() => props.navigation.navigate('#')} block={true} type={'secondary'} text={"Add the card"}/>
        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    inputs: {
        width: '100%',
    },
    label: {
        marginBottom: scaleSize(2)
    },
    title: {
        flex: 1,
        color: Colors.PRIMARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_22,
        lineHeight: Typography.LINE_HEIGHT_18,
        marginBottom: scaleSize(12),
        marginTop: scaleSize(26)
    },
})

export default GiftCardAddScreen
