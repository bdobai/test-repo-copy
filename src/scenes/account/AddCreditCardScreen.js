import React, { Component, useState } from 'react'
import { View, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, Pressable, SafeAreaView, Text } from 'react-native'
import Header from '_components/molecules/Header'
import BackButton from '_atoms/BackButton'
import Container from '_atoms/Container'
import { Colors, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'
import { request } from '_utils/request'
import { Controller, useForm } from 'react-hook-form'
import Card from '_atoms/Card'
import { TextField } from '_atoms/MaterialField'
import Button from '_atoms/Button'
import { creditCardValidator, zipCodeValidator } from '_utils/validators'
import { dispatch } from 'use-bus'
import { NotificationsStoreContext } from '_stores'
import Logo from '_assets/images/logo_small_white.svg'

const AddCreditCardScreen = (props) => {
    const { control, handleSubmit, setFocus, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            number: '',
            expire_date: '',
            cvv: '',
            zip_code: '',
        }
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        console.log(data)
        setLoading(true)

        request('/payments/setup-intent', {
            method: 'POST',
            success: function (response) {
                confirmSetupIntent(response.intent.client_secret, data)
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    const confirmSetupIntent = async (client_secret, data) => {
        console.log({client_secret})
        const parts = data.expire_date.split('/');
        try {
            const result = await stripe.confirmSetupIntent({
                clientSecret: client_secret,
                paymentMethod: {
                    card: {
                        number: data.number,
                        expMonth: parseFloat(parts[0]),
                        expYear: parseFloat(parts[1]),
                        cvv: data.cvv,
                        // optional
                        name: data.name,
                        currency: 'USD',
                        addressZip: data.zip_code,
                    }
                }
            })
            const expirationData = data.expire_date.split('/');
            request('/user/billing-profile/add.json', {
                method: 'POST',
                data: {
                    'cvv': data.cvv,
                    'number': data.number, //TODO hash
                    'name': data.name,
                    'expiry_month': parseFloat(expirationData[0]),
                    'expiry_year': parseFloat(expirationData[1]),
                    'token': result.paymentMethodId,
                },
                success: function (response) {
                    dispatch('PAYMENTS/REFRESH-LIST')
                    props.navigation.goBack()
                    setLoading(false)
                },
                error: () => {
                    setLoading(false)
                }
            });
        } catch (error) {
            NotificationsStoreContext._currentValue.addNotification({
                title: 'Error',
                description: error.message,
                type: 'error'
            })
            setLoading(false)
            // handle exception here
        }
        // createPaymentMethod(data)
    }

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1, backgroundColor: Colors.PRIMARY }}>
        <Header left={<BackButton/>} center={<Logo/>}/>
        <Text style={styles.title}>ADD NEW CREDIT CARD</Text>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1}}>
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Controller
                      control={control}
                      render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                          autoCompleteType={'off'}
                          autoCorrect={false}
                          autoCapitalize={'none'}
                          onBlur={onBlur}
                          onChangeText={value => onChange(value)}
                          value={value}
                          onSubmitEditing={() => setFocus('number')}
                          ref={ref}
                          error={errors.name?.message}
                          containerStyle={{ marginBottom: Spacing.SPACING_3, marginTop: 30 }} label='Name on card'/>
                      )}
                      name="name"
                      rules={{ required: 'Cardholder name is required'}}
                    />
                    <Controller
                      control={control}
                      render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                          autoCompleteType={'off'}
                          autoCorrect={false}
                          autoCapitalize={'none'}
                          onBlur={onBlur}
                          submitOnFull={true}
                          onChangeText={value => onChange(value)}
                          value={value}
                          onSubmitEditing={() => setFocus('expire_date')}
                          ref={ref}
                          mask={"#### #### #### ####"}
                          keyboardType={'decimal-pad'}
                          error={errors.number?.message}
                          label='Credit card number'/>
                      )}
                      name="number"
                      rules={{ required: 'Card number is required'}}
                      // rules={{ required: 'Card number is required', pattern: creditCardValidator}}
                    />
                    <Controller
                      control={control}
                      render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                          autoCompleteType={'off'}
                          autoCorrect={false}
                          autoCapitalize={'none'}
                          onBlur={onBlur}
                          submitOnFull={true}
                          onChangeText={value => onChange(value)}
                          value={value}
                          keyboardType={'decimal-pad'}
                          onSubmitEditing={() => setFocus('cvc')}
                          ref={ref}
                          error={errors.cvv?.message}
                          />
                      )}
                      name="cvv"
                      rules={{ required: 'CVV is required'}}
                    />
                    <Text style={ styles.expirationText }>Expiration date</Text>
                    <View style={styles.row}>
                        <View style={styles.col1}>
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                  <TextField
                                    autoCompleteType={'off'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    onBlur={onBlur}
                                    submitOnFull={true}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    keyboardType={'decimal-pad'}
                                    onSubmitEditing={() => handleSubmit(onSubmit)}
                                    ref={ref}
                                    mask={"##/##"}
                                    error={errors.expire_date?.message}
                                    label='CVC'/>
                              )}
                              name="expire_date"
                              rules={{ required: 'Expiration date is required'}}
                            />
                        </View>
                    </View>
                </Container>
            </SafeAreaView>
            <View style={styles.footer}>
                <Pressable onPress={() => props.navigation.navigate('AccountSettings.MyPayments')} style={ styles.cancelBtnWrapper}>
                    <Text style={styles.cancelBtn}>Cancel</Text>
                </Pressable>
                <Pressable onPress={() => handleSubmit(onSubmit)} style={ styles.saveBtnWrapper}>
                    <Text style={styles.saveBtn}>Save</Text>
                </Pressable>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>

}

const styles = StyleSheet.create({
    cancelBtnWrapper: {
        flexGrow: 1,
        marginRight: scaleSize(13)
    },
    saveBtnWrapper: {
        flexGrow: 1,
    },
    cancelBtn: {
        color: Colors.WHITE,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderColor: Colors.WHITE,
        borderWidth: scaleSize(1),
        borderRadius: scaleSize(6),
        height: scaleSize(55),
    },
    saveBtn: {
        color: Colors.WHITE,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: scaleSize(6),
        height: scaleSize(55),
        backgroundColor: Colors.SECONDARY_LIGHT
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.SPACING_5,
        marginBottom: Spacing.SPACING_4,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    col1: {
        width: scaleSize(100),
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
    expirationText: {
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_12
    }
})

export default AddCreditCardScreen
