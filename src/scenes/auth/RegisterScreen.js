import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View, Linking } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { AuthStoreContext } from '_stores'
import { emailValidator } from '_utils/validators'
import DeviceInfo from 'react-native-device-info';
import { scaleSize } from '_styles/mixins'
import CheckBox from '_components/atoms/CheckBox'

const RegisterScreen = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const nameRef = React.useRef()
    const emailRef = React.useRef()
    const phoneRef = React.useRef()
    const passwordRef = React.useRef()
    const confirmPasswordRef = React.useRef()

    const [loading, setLoading] = useState(false);
    const [agreeWithTerms, setAgreeWithTerms] = useState(false);
    const [agreeNewsletter, setAgreeNewsletter] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    const onSubmit = data => {
        let deviceId = DeviceInfo.getDeviceId();

        props.navigation.navigate('Register_2');

        setLoading(true)
        // request('/auth/register', {
        //     method: 'POST',
        //     data: {...data, ...{app_device_id: deviceId}},
        //     withToken: false,
        //     success: function (response) {
        //         setLoading(false)
        //         authStore.getUser()
        //     },
        //     error: () => {
        //         setLoading(false)
        //     }
        // });
    };

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <Container style={{ flex: 1 }}>
                        <Header bg={false} center={<Text style={ styles.signupTitle }>SIGN UP 1/3</Text>} style={{marginTop: scaleSize(10)}}/>
                        <View style={ styles.login } title={'Enter your credentials'}>
                            <Controller
                              control={control}
                              onFocus={() => {emailRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  autoCorrect={false}
                                  autoCapitalize={'none'}
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  keyboardType={'email-address'}
                                  onSubmitEditing={() => passwordRef.current.focus()}
                                  ref={emailRef}
                                  error={errors.email?.message}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='E-mail*'/>
                              )}
                              name="email"
                              rules={{ required: 'Email is required', pattern: emailValidator}}
                              defaultValue={props.route.params ? props.route.params.email : ''}
                            />
                            <Controller
                              control={control}
                              onFocus={() => {passwordRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secure={true}
                                  ref={passwordRef}
                                  error={errors.password && true}
                                  onSubmitEditing={() => confirmPasswordRef.current.focus()}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }}
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
                            <Controller
                              control={control}
                              onFocus={() => {confirmPasswordRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secure={true}
                                  ref={confirmPasswordRef}
                                  error={errors.password && true}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }}
                                  label='Confirm password*'/>
                              )}
                              name="confirm_password"
                              rules={{
                                  required: true,
                                  minLength: {
                                      value: 6,
                                      message: 'password must be at least 6'
                                  }}
                              }
                              defaultValue=""
                            />
                            <Text style={styles.infoText}>At least 6 characters (including 1 lowercase, 1 capital, 1 number)</Text>
                            <View style={{ marginTop: 20 }}>
                                <CheckBox onPress={() => setAgreeWithTerms(!agreeWithTerms)} 
                                        checked={agreeWithTerms} 
                                        label={'I have read and agree to the'}
                                        urlLink={"https://google.com"}
                                        urlText={'Terms of Service and Privacy Policy'} //TODO change this
                                        />
                                <CheckBox onPress={() => setAgreeNewsletter(!agreeNewsletter)} checked={agreeNewsletter} label={'Yes, I agree to receiving news, exclusive offers and more from Costa Coffee.'}/>
                            </View>
                        </View>
                        <View style={styles.footer}>
                            {/* <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Next'}/> */}
                            {/* Temporary button - must be removed */}
                            <Button type={'secondary'} 
                                text={'Next'}
                                onPress={() => props.navigation.navigate('Register_2')}
                            />
                            <View style={styles.footerTextView}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
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
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
    },
    footerActionText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        color: Colors.SECONDARY
    },
    footerText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14
    },
    footerTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.SPACING_4
    },
    login: {
        flex: 3,
        justifyContent: 'center'
    },
    signupScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    signupTitle: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.SECONDARY
    },
})

export default RegisterScreen
