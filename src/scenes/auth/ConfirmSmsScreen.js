import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from "_styles";
import Container from '_components/atoms/Container'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { AuthStoreContext } from '_stores'
import { scaleSize } from '_styles/mixins'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextField from "_atoms/TextField";
import { AuthHeaderText } from "_atoms/AuthHeaderText";

const ConfirmSmsScreen = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const [loading, setLoading] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => <Text style={styles.page}>3 of 3</Text>
        })
    },[])

    const onSubmit = () => {
        // console.log({ props }, { data })
        return;
        setLoading(true)
        request('/user/activate/sms.json', {
            method: 'GET',
            data: {
                // "contact_consent": 3,

            },
            withToken: true,
            success: function (response) {
                console.log(response)
                AsyncStorage.setItem('online_order_token', response.online_order_token)
                AsyncStorage.setItem('session_key', response.session_identifier)
                setLoading(false)
                authStore.getUser()
            },
            error: (error) => {
                console.log('error', error)
                setLoading(false)
            }
        });
    };



    const resendCode = () => {
        request('/user/activate/sms.json', {
            method: 'GET',
            data: {
                // "contact_consent": 3,

            },
            withToken: true,
            success: function (response) {
                console.log(response)
                AsyncStorage.setItem('online_order_token', response.online_order_token)
                AsyncStorage.setItem('session_key', response.session_identifier)
                setLoading(false)
                authStore.getUser()
            },
            error: (error) => {
                console.log('error', error.error.errors[0])
                setLoading(false)
            }
        });
    };

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <AuthHeaderText text={'Register'}/>
                    <Container style={{ flex: 1 }}>
                        <Text style={ styles.infoText }>Please type the verification code sent to +971 424 242 942</Text>
                        <View style={ styles.register } title={'Enter your credentials'}>
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secure={true}
                                  ref={ref}
                                  placeholder={'Confirmation code'}
                                  error={errors.password && true}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  label='CONFIRM CODE'/>
                              )}
                              name="confirm_code"
                              rules={{
                                  required: true,
                                  minLength: {
                                      value: 4,
                                      message: 'code must be at least 4'
                                  }}
                              }
                              defaultValue=""
                            />
                            <View>
                                <Pressable onPress={() => resendCode()}><Text style={styles.resendText}>Resend code</Text></Pressable>
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <Button
                                loading={loading}
                                textStyle={styles.buttonTitle}
                                bodyStyle={styles.button}
                                onPress={handleSubmit(onSubmit)}
                                block={true}
                                type={'primary'}
                                text={'NEXT'}
                            />
                            <View style={styles.footerTextView}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <Pressable onPress={() => props.navigation.navigate('Login')}><Text style={styles.footerActionText}>Log in</Text></Pressable>
                            </View>
                        </View>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
}

const styles = StyleSheet.create({
    infoText: {
        color: Colors.BLUE_GRAY,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        marginTop: Spacing.SPACING_5,
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    footerActionText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontWeight: '500',
        textDecorationLine: 'underline'
    },
    footerText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontWeight: '500'
    },
    footerTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    register: {
        flex: 1,
        justifyContent: 'center'
    },
    resendText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
    },
    signupScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    signupTitle: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.PRIMARY
    },
    page: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontSize: Typography.FONT_SIZE_20,
        color: Colors.PRIMARY,
        marginRight: Spacing.SPACING_1,
        fontWeight: '700',
    },
})

export default ConfirmSmsScreen
