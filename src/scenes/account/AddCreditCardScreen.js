import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
    Text,
    Keyboard, Pressable,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { AuthStoreContext } from '_stores'
import { monthValidator, requiredValidation, yearValidator } from "_utils/validators";
import { request } from '_utils/request'
import SectionTitle from '_atoms/SectionTitle';
import TextField from "_atoms/TextField";
import { scaleSize } from "_styles/mixins";

const AddCreditCardScreen = (props) => {
    const { control, handleSubmit, formState: { errors }, setFocus } = useForm({ mode: 'onSubmit'});

    const [loading, setLoading] = useState(false);

    const onSubmit = data => {
        console.log('data',data);
        setLoading(true)
        request('/user/billing-profile/add.json', {
            method: 'POST',
            data: {
                "cvv": data.cvv,
                "expiry_month": data.month,
                "expiry_year": data.year,
                "name": `${data.name}`,
                "number": data.number,
                "description": "Stripe Test Card",
                "zip_code":"90210"
            },
            withToken: true,
            withoutJson: true,
            success: (response) => {
                console.log('response', response);
                setLoading(false)
            },
            error: (e) => {
                console.log('e',e)
                setLoading(false)
            }
        })
    }

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={styles.screen}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: scaleSize(120) }}>
            <Container style={ styles.container }>
                <SectionTitle textStyle={styles.title}>Personal New Credit Card</SectionTitle>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('number')}
                            ref={ref}
                            error={errors.name?.message}
                            placeholder='Cardholder name'
                            label='CARDHOLDER NAME'/>
                    )}
                    name="name"
                    rules={{ required: 'First name is required', pattern: requiredValidation}}
                />
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            keyboardType={'phone-pad'}
                            onSubmitEditing={() => setFocus('cvv')}
                            ref={ref}
                            maxLength={16}
                            error={errors.number?.message}
                            placeholder='Card number'
                            label='CARD NUMBER'/>
                    )}
                    name="number"
                    rules={{ required: 'Card number is required', pattern: requiredValidation}}
                />
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            rightAccessory={() => <Pressable disabled={true} style={{justifyContent:'center'}}><Text style={styles.cvv}>CVV</Text></Pressable>}
                            ref={ref}
                            maxLength={4}
                            error={errors.cvv?.message}
                            onSubmitEditing={() => setFocus('month')}
                            label='SECURITY CODE'/>
                    )}
                    name="cvv"
                    rules={{required: true}}
                />
                <View style={styles.divider}/>
                <View style={styles.namesWrapper}>
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                                styleInput={{width:'47%'}}
                                autoCorrect={false}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                onSubmitEditing={() => setFocus('year')}
                                ref={ref}
                                maxLength={2}
                                error={errors.month?.message}
                                placeholder='DD/MM'
                                label='EXPIRATION DATE'/>
                        )}
                        name="month"
                        rules={{ required: 'First name is required', pattern: monthValidator}}
                    />
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                                styleInput={{width:'47%'}}
                                autoCorrect={false}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                maxLength={4}
                                onSubmitEditing={Keyboard.dismiss}
                                ref={ref}
                                error={errors.year?.message}
                                placeholder='YYYY'
                                label=' '/>
                        )}
                        name="year"
                        rules={{ required: 'Year is required', pattern: yearValidator}}
                    />
                </View>
            </Container>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'Save Card'}/>
        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    container: {
        flex: 1,
        paddingBottom: Spacing.SPACING_5,
    },
    divider: {
        width:'100%',
        backgroundColor: Colors.LIGHT_GREY,
        height: 1,
        marginBottom: Spacing.SPACING_4,
    },
    namesWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    footer: {
        bottom: scaleSize(30),
        paddingHorizontal: Spacing.SPACING_5
    },
    title: {
        fontSize: Typography.FONT_SIZE_22,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.BLACK,
        fontWeight:'700'
    },
    cvv: {
        justifyContent:'center',
        paddingRight: Spacing.SPACING_4,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        color: '#647581',
        alignSelf:'center'
    },
})

export default AddCreditCardScreen
