import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, Pressable, View, ScrollView } from 'react-native';
import Header from '_components/molecules/Header'
import Logo from '_assets/images/logo.svg'
import { Colors, Spacing, Typography } from '_styles'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import { useForm, Controller } from "react-hook-form";
import { request } from '_utils/request'
import { emailValidator } from '_utils/validators'
import { AuthStoreContext, NotificationsStoreContext } from '_stores'
import { scaleSize } from '_styles/mixins'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import analytics from '@react-native-firebase/analytics'

const LoginScreen = (props) => {

    const { control, handleSubmit, setFocus, formState: { errors } } = useForm();

    const [loading, setLoading] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    const onSubmit = data => {
        setLoading(true)
        request('/user/authenticate.json', {
            method: 'POST',
            data: {
                "email_address": data.email,
                "password": data.password,
              },
            withToken: false,
            success: function (response) {
                console.log(response)
                AsyncStorage.setItem('online_order_token', response.online_order_token)
                AsyncStorage.setItem('session_key', response.session_identifier)
                setLoading(false)
                authStore.getUser()
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1}}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} >
                    <SafeAreaView style={ styles.loginScreen }>
                        <Header bg={false} center={<Logo style={ styles.logo }/>} style={{marginTop: scaleSize(50)}}/>
                        <View style={ styles.login } title={'Enter your credentials'}>
                            <Text style={styles.loginText}>LOG IN</Text>
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  autoCorrect={false}
                                  autoCapitalize={'none'}
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  keyboardType={'email-address'}
                                  onSubmitEditing={() => setFocus('password')}
                                  ref={ref}
                                  error={errors.email?.message}
                                  label='Email*'/>
                              )}
                              name="email"
                              rules={{ required: 'Email is required', pattern: emailValidator}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  autoCorrect={false}
                                  autoCapitalize={'none'}
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secure={true}
                                  ref={ref}
                                  error={errors.password?.message}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  label='Password*'/>
                              )}
                              name="password"
                              rules={{
                                  required: true,
                                  minLength: {
                                      value: 6,
                                      message: 'password must be at least 6'
                                  }}
                              }
                              defaultValue=""
                            />
                            <View style={ styles.forgot }>
                                <Pressable onPress={() => props.navigation.navigate('Recover')}><Text style={styles.forgotText}>Forgot your password ?</Text></Pressable>
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Log in'}/>
                            <View style={styles.footerTextView}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <Pressable onPress={() => props.navigation.navigate('Register')}><Text style={styles.footerActionText}>Sign up</Text></Pressable>
                            </View>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
    },
    footerText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14
    },
    footerActionText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        color: Colors.SECONDARY
    },
    footerTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.SPACING_4
    },
    forgot: {
        alignItems: 'flex-end',
    },
    forgotText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
    },
    login: {
        flex: 3,
        justifyContent: 'center'
    },
    loginScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: Spacing.SPACING_5,
    },
    loginText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.SECONDARY,
        marginBottom: scaleSize(34)
    },
})

export default LoginScreen
