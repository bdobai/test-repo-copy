import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { AuthStoreContext } from '_stores'
import DeviceInfo from 'react-native-device-info';
import { scaleSize } from '_styles/mixins'

const RegisterScreen_3 = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const confirmCodeRef = React.useRef()

    const [loading, setLoading] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    const onSubmit = data => {
        let deviceId = DeviceInfo.getDeviceId();

        setLoading(true)
        request('/auth/register', {
            method: 'POST',
            data: {...data, ...{app_device_id: deviceId}},
            withToken: false,
            success: function (response) {
                setLoading(false)
                authStore.getUser()
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    const resendCode = () => {
        console.log('resend code')
    };

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <Container style={{ flex: 1 }}>
                        <Header bg={false} center={<Text style={ styles.signupTitle }>SIGN UP 3/3</Text>} style={{marginTop: scaleSize(10)}}/>
                        <View style={ styles.register } title={'Enter your credentials'}>
                            <Text style={ styles.infoText }>Please type the verification code sent to +971 424 242 942</Text>
                            <Controller
                              control={control}
                              onFocus={() => {confirmCodeRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secure={true}
                                  ref={confirmCodeRef}
                                  error={errors.password && true}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }}
                                  label='Confirm code*'/>
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
                            {/* <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Next'}/> */}
                            <Button loading={loading} onPress={() => props.navigation.navigate('Verification')} block={true} type={'secondary'} text={'Next'}/>
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
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_30,
        fontFamily: Typography.FONT_PRIMARY_REGULAR
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 20,
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
        marginTop: 20
    },
    register: {
        flex: 1,
        justifyContent: 'center'
    },
    resendText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
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

export default RegisterScreen_3
