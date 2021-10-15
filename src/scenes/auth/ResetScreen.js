import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native'
import Header from '_components/molecules/Header'
import PageTitle from '_components/atoms/PageTitle'
import Card from '_components/atoms/Card'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_atoms/Button'
import { request } from '_utils/request'
import { Controller, useForm } from 'react-hook-form'
import { scaleSize } from '_styles/mixins'

const ResetScreen = (props) => {
    const { control, handleSubmit, setFocus, formState: { errors } } = useForm();
    const { email } = props.route.params;

    const [loading, setLoading] = useState(false);

    function onSubmit(data) {
        setLoading(true)
        data.email = email;
        request('/auth/reset', {
            method: 'POST',
            data: data,
            withToken: false,
            success: function (response) {
                props.navigation.navigate('Login')
                setLoading(false)
            },
            error: () => {
                setLoading(false)
            }
        });
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <Container style={{ flex: 1 }}>
                    <Header bg={false} center={<PageTitle title={'Reset password'}/>} style={{marginTop: scaleSize(50)}}/>
                    <Card title={'Enter code from email and new password'}>
                        <TextField
                          value={email}
                          disabled={true}
                          label='Email'/>
                        <Controller
                          control={control}
                          render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                              value={value}
                              onSubmitEditing={() => setFocus('password')}
                              ref={ref}
                              error={errors.code?.message}
                              label='Code'/>
                          )}
                          name="code"
                          defaultValue=""
                          rules={{ required: 'Code is required'}}
                        />
                        <Controller
                          control={control}
                          render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                              value={value}
                              secure={true}
                              onSubmitEditing={() => handleSubmit(onSubmit)}
                              ref={ref}
                              error={errors.password?.message}
                              label='New password'/>
                          )}
                          name="password"
                          defaultValue=""
                          rules={{ required: 'Password is required', minLength: 6}}
                        />

                        <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'SEND'}/>
                    </Card>
                    <View style={styles.footer}>
                        <View><Text style={styles.footerText}>Have an account?</Text></View>
                        <Pressable onPress={() => props.navigation.navigate('Login')}><Text style={styles.footerActionText}>LOGIN</Text></Pressable>
                    </View>
                </Container>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        paddingBottom: 50
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
    }
})

export default ResetScreen
