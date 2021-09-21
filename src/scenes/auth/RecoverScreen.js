import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import Header from '_components/molecules/Header'
import Logo from '_assets/images/logo.svg'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_atoms/Button'
import { request } from '_utils/request'
import { emailValidator } from '_utils/validators'
import { Controller, useForm } from 'react-hook-form'
import { scaleSize } from '_styles/mixins'

const RecoverScreen = (props) => {
    const { control, handleSubmit, errors } = useForm();

    const emailRef = React.useRef()
    const [loading, setLoading] = useState(false);

    function onSubmit(data) {
        setLoading(true)
        request('/auth/recover', {
            method: 'POST',
            data: data,
            withToken: false,
            success: function (response) {
                props.navigation.navigate('Reset', {email: data.email})
                setLoading(false)
            },
            error: () => {
                setLoading(false)
            }
        });
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.recoverScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <Container style={{ flex: 1 }}>
                        <Header bg={false} center={<Logo style={ styles.logo }/>} style={{ flex:1, marginTop: scaleSize(50)}}/>
                        <View style={ styles.forgot } title={'Enter your email address'}>
                            <Text style={styles.forgotPassTitle}>FORGOT PASSWORD</Text>
                            <Text style={styles.forgotPassDescription}>Please enter your email address and we will send you a link to reset password.</Text>
                            <Controller
                              control={control}
                              onFocus={() => {emailRef.current.focus()}}
                              render={({ onChange, onBlur, value }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  keyboardType={'email-address'}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  ref={emailRef}
                                  error={errors.email?.message}
                                  containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Email*'/>
                              )}
                              name="email"
                              rules={{ required: 'Email is required', pattern: emailValidator}}
                              defaultValue={''}
                            />
                        </View>
                        <View style={styles.footer}>
                        <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Reset password'}/>
                            {/* <View><Text style={styles.footerText}>Have an account?</Text></View>
                            <Pressable onPress={() => props.navigation.navigate('Login')}><Text style={styles.footerActionText}>LOGIN</Text></Pressable> */}
                        </View>
                    </Container>
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
        paddingBottom: 30
    },
    forgot: {
        flex: 1,
    },
    forgotPassTitle: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.SECONDARY
    },
    forgotPassDescription: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_23,
        color: Colors.WHITE,
        marginVertical: 20
    },
    // footerText: {
    //     color: Colors.GRAY_DARK,
    //     fontFamily: Typography.FONT_PRIMARY_LIGHT,
    //     fontSize: Typography.FONT_SIZE_12,
    //     lineHeight: Typography.LINE_HEIGHT_12
    // },
    // footerActionText: {
    //     fontFamily: Typography.FONT_PRIMARY_BOLD,
    //     fontSize: Typography.FONT_SIZE_16,
    //     lineHeight: Typography.LINE_HEIGHT_16,
    //     color: Colors.SECONDARY
    // },
    recoverScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.PRIMARY,
    }
})

export default RecoverScreen
