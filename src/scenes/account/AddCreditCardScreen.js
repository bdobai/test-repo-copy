import React, { Component, useState } from 'react'
import { View, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import Header from '_components/molecules/Header'
import PageTitle from '_atoms/PageTitle'
import BackButton from '_atoms/BackButton'
import IconPlaceholder from '_atoms/IconPlaceholder'
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
import { HEADER_SPACE } from '_styles/spacing'

const AddCreditCardScreen = (props) => {
    const { control, handleSubmit, errors } = useForm({
        defaultValues: {
            name: '',
            card: '',
            expire_date: '',
            cvc: '',
            zip_code: '',
        }
    });

    const nameRef = React.useRef()
    const cardRef = React.useRef()
    const dateRef = React.useRef()
    const cvcRef = React.useRef()
    const zipRef = React.useRef()

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
                        number: data.card,
                        expMonth: parseFloat(parts[0]),
                        expYear: parseFloat(parts[1]),
                        cvc: data.cvc,
                        // optional
                        name: data.name,
                        currency: 'USD',
                        addressZip: data.zip_code,
                    }
                }
            })
            request('/payments/credit-cards/add', {
                method: 'POST',
                data: {
                    'card': data.card, //TODO hash
                    'name': data.name,
                    'expire_date': data.expire_date,
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

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
        <Header left={<BackButton/>} center={<PageTitle size={'small'} title={'Add Credit Card'}/>} right={<IconPlaceholder/>}/>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: HEADER_SPACE }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Card title={'Add a new credit card'}
                          subTitle={'Enter your credit card details'}
                          style={{ marginTop: 20 }}>
                        <Controller
                          control={control}
                          onFocus={() => {nameRef.current.focus()}}
                          render={({ onChange, onBlur, value }) => (
                            <TextField
                              autoCompleteType={'off'}
                              autoCorrect={false}
                              autoCapitalize={'none'}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                              value={value}
                              onSubmitEditing={() => cardRef.current.focus()}
                              ref={nameRef}
                              error={errors.name?.message}
                              containerStyle={{ marginBottom: Spacing.SPACING_3, marginTop: 30 }} label='Name on card'/>
                          )}
                          name="name"
                          rules={{ required: 'Name is required'}}
                        />
                        <Controller
                          control={control}
                          onFocus={() => {cardRef.current.focus()}}
                          render={({ onChange, onBlur, value }) => (
                            <TextField
                              autoCompleteType={'off'}
                              autoCorrect={false}
                              autoCapitalize={'none'}
                              onBlur={onBlur}
                              submitOnFull={true}
                              onChangeText={value => onChange(value)}
                              value={value}
                              onSubmitEditing={() => dateRef.current.focus()}
                              ref={cardRef}
                              mask={"#### #### #### ####"}
                              keyboardType={'decimal-pad'}
                              error={errors.card?.message}
                              containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Credit card number'/>
                          )}
                          name="card"
                          rules={{ required: 'Card number is required'}}
                          // rules={{ required: 'Card number is required', pattern: creditCardValidator}}
                        />

                        <View style={styles.row}>
                            <View style={styles.col1}>
                                <Controller
                                  control={control}
                                  onFocus={() => {dateRef.current.focus()}}
                                  render={({ onChange, onBlur, value }) => (
                                    <TextField
                                      autoCompleteType={'off'}
                                      autoCorrect={false}
                                      autoCapitalize={'none'}
                                      onBlur={onBlur}
                                      submitOnFull={true}
                                      onChangeText={value => onChange(value)}
                                      value={value}
                                      keyboardType={'decimal-pad'}
                                      onSubmitEditing={() => cvcRef.current.focus()}
                                      ref={dateRef}
                                      mask={"##/##"}
                                      error={errors.expire_date?.message}
                                      containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='MM/YY'/>
                                  )}
                                  name="expire_date"
                                  rules={{ required: 'Date is required'}}
                                />
                            </View>
                            <View style={styles.col2}>
                                <Controller
                                  control={control}
                                  onFocus={() => {cvcRef.current.focus()}}
                                  render={({ onChange, onBlur, value }) => (
                                      <TextField
                                        autoCompleteType={'off'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={onBlur}
                                        submitOnFull={true}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        keyboardType={'decimal-pad'}
                                        onSubmitEditing={() => zipRef.current.focus()}
                                        ref={cvcRef}
                                        mask={"####"}
                                        error={errors.cvc?.message}
                                        containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='CVC'/>
                                  )}
                                  name="cvc"
                                  rules={{ required: 'CVC is required'}}
                                />
                            </View>
                            <View style={styles.col1}>
                                <Controller
                                  control={control}
                                  onFocus={() => {zipRef.current.focus()}}
                                  render={({ onChange, onBlur, value }) => (
                                    <TextField
                                      autoCompleteType={'off'}
                                      autoCorrect={false}
                                      autoCapitalize={'none'}
                                      onBlur={onBlur}
                                      onChangeText={value => onChange(value)}
                                      value={value}
                                      keyboardType={'decimal-pad'}
                                      onSubmitEditing={() => handleSubmit(onSubmit)}
                                      ref={zipRef}
                                      mask={'#####'}
                                      error={errors.zip_code?.message}
                                      containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Zip Code'/>
                                  )}
                                  name="zip_code"
                                  rules={{ pattern: zipCodeValidator}}
                                />
                            </View>
                        </View>
                        <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'ADD CARD'}/>
                    </Card>
                </Container>
            </SafeAreaView>
        </ScrollView>
    </KeyboardAvoidingView>

}

const styles = StyleSheet.create({
    info: {
        paddingTop: Spacing.SPACING_3,
    },
    infoText: {
        textAlign: 'center',
        color: Colors.MUTED,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        fontFamily: Typography.FONT_PRIMARY_REGULAR
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column'
        // paddingBottom: 50
    },
    footerText: {
        color: Colors.GRAY_DARK,
        fontFamily: Typography.FONT_PRIMARY_LIGHT,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12
    },
    footerActionText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.SECONDARY
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    col1: {
        position: 'relative',
        flex: 1,
        marginRight: Spacing.SPACING_2,
        overflow: 'hidden',
    },
    col2: {
        position: 'relative',
        flex: 1,
        marginLeft: Spacing.SPACING_3,
        overflow: 'hidden',
    },
    avatarWrapper: {
        width: scaleSize(100),
        height: scaleSize(100),
        position: 'absolute',
        left: '50%',
        top: scaleSize(-50),
        marginLeft: scaleSize(-25),
        borderRadius: scaleSize(50),
        backgroundColor: '#DDF6FE',
        borderWidth: 3,
        borderColor: Colors.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageBtn: {
        width: scaleSize(40),
        height: scaleSize(40),
        position: 'absolute',
        left: scaleSize(30),
        bottom: scaleSize(-20),
        borderRadius: scaleSize(20),
        backgroundColor: Colors.GRAY_MEDIUM,
        borderWidth: 3,
        borderColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: scaleSize(50),
    }
})

export default AddCreditCardScreen
