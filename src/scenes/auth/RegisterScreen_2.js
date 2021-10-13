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
import { phoneValidator } from '_utils/validators'
import DeviceInfo from 'react-native-device-info';
import { scaleSize } from '_styles/mixins'

const RegisterScreen_2 = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const nameRef = React.useRef()
    const countryRef = React.useRef()
    const phoneRef = React.useRef()
    const birthdateRef = React.useRef()

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

    const termsLink = () => {
        const url="https://google.com"
        return <Text onPress={() => Linking.openURL(url)}>
                    {url}
                </Text>
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <Container style={{ flex: 1 }}>
                        <Header bg={false} center={<Text style={ styles.signupTitle }>SIGN UP 2/3</Text>} style={{marginTop: scaleSize(10)}}/>
                        <View style={ styles.login } title={'Enter your credentials'}>
                            <Controller
                              control={control}
                              onFocus={() => {nameRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  autoCorrect={false}
                                  autoCapitalize={'none'}
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  onSubmitEditing={() => countryRef.current.focus()}
                                  ref={nameRef}
                                  error={errors.name?.message}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Name*'/>
                              )}
                              name="name"
                              rules={{ required: 'Name is required'}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              onFocus={() => {countryRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  onSubmitEditing={() => phoneRef.current.focus()}
                                  ref={countryRef}
                                  error={errors.phone?.message}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Country*'/>
                              )}
                              name="country"
                              rules={{ required: 'Country is required'}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              onFocus={() => {phoneRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  keyboardType={'phone-pad'}
                                  onSubmitEditing={() => birthdateRef.current.focus()}
                                  ref={phoneRef}
                                  error={errors.phone?.message}
                                  mask={"+1 (###) ###-####"}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Phone number*'/>
                              )}
                              name="phone"
                              rules={{ required: 'Phone no. is required', pattern: phoneValidator}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              onFocus={() => {birthdateRef.current.focus()}}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  ref={birthdateRef}
                                  error={errors.phone?.message}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Date of birth'/>
                              )}
                              name="birthdate"
                              defaultValue={''}
                            />
                        </View>
                        <View style={styles.footer}>
                            {/* <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={''Verify phone number'}/> */}
                            {/* Temporary button - must be removed */}
                            <Button type={'secondary'} 
                                text={'Verify phone number'}
                                onPress={() => props.navigation.navigate('Register_3')}
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
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM
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

export default RegisterScreen_2
