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
import { monthValidator, requiredValidation, yearValidator } from "_utils/validators";
import { request } from '_utils/request'
import SectionTitle from '_atoms/SectionTitle';
import TextField from "_atoms/TextField";
import { scaleSize } from "_styles/mixins";

const AddCreditCardScreen = (props) => {
    const { control, handleSubmit, formState, setFocus } = useForm({ mode: 'onChange'});

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
                "description": `${data.name}`,
                "zip_code":"90210"
            },
            withToken: true,
            withoutJson: true,
            success: (response) => {
                console.log('response', response);
                props.navigation.goBack();
                setLoading(false)
            },
            error: (e) => {
                console.log('e',e)
                setLoading(false)
            }
        })
    }

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={styles.screen}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: scaleSize(40) }}>
            <Container style={ styles.container }>
                <SectionTitle textStyle={styles.title}>Personal New Credit Card</SectionTitle>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            round={true}
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('number')}
                            ref={ref}
                            error={formState.errors.name?.message}
                            placeholder='Cardholder name'
                            label='Cardholder name'/>
                    )}
                    name="name"
                    rules={{ required: 'First name is required', pattern: requiredValidation}}
                />
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            round={true}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            keyboardType={'phone-pad'}
                            onSubmitEditing={() => setFocus('cvv')}
                            ref={ref}
                            error={formState.errors.number?.message}
                            maxLength={16}
                            placeholder='Card number'
                            label='Card number'/>
                    )}
                    name="number"
                    rules={{ required: 'Card number is required', pattern: requiredValidation}}
                />
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            round={true}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            rightAccessory={() => <Pressable disabled={true} style={{justifyContent:'center'}}><Text style={styles.cvv}>CVV</Text></Pressable>}
                            ref={ref}
                            maxLength={4}
                            keyboardType={'phone-pad'}
                            error={formState.errors.cvv?.message}
                            placeholder='Security code'
                            onSubmitEditing={() => setFocus('month')}
                            label='Security code'/>
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
                                round={true}
                                styleInput={{width:'47%'}}
                                autoCorrect={false}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                onSubmitEditing={() => setFocus('year')}
                                ref={ref}
                                maxLength={2}
                                error={formState.errors.month?.message}
                                placeholder='MM'
                                keyboardType={'phone-pad'}
                                label='Expiration date'/>
                        )}
                        name="month"
                        rules={{ required: 'First name is required', pattern: monthValidator}}
                    />
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                                round={true}
                                styleInput={{width:'47%'}}
                                autoCorrect={false}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                maxLength={4}
                                onSubmitEditing={Keyboard.dismiss}
                                ref={ref}
                                error={formState.errors.year?.message}
                                placeholder='YYYY'
                                keyboardType={'phone-pad'}
                                label=' '/>
                        )}
                        name="year"
                        rules={{ required: 'Year is required', pattern: yearValidator}}
                    />
                </View>
            </Container>
            <View style={styles.footer}>
                <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'Save Card'} disabled={!formState.isValid}/>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    container: {
        flex: 1,
        // paddingBottom: Spacing.SPACING_5,
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
        // flex:1,
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
