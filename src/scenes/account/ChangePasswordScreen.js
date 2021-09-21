import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import BackButton from '_atoms/BackButton'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_2.svg'

const ChangePasswordScreen = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const currentPasswordRef = React.useRef()
    const newPasswordRef = React.useRef()
    const repeatPasswordRef = React.useRef()
    const [loading, setLoading] = useState(false);

    const onSubmit = data => {
        setLoading(true)
        request('/account/change-password', {
            method: 'POST',
            data: data,
            success: function (response) {
                setLoading(false)
                props.navigation.navigate('AccountSettings')
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.changePasswordScreen}>
        <Header left={<BackButton/>} center={<Logo style={ styles.logo }/>}/>
        <Text style={styles.title}>CHANGE PASSWORD</Text>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                    <Container style={ styles.container }>
                        <Controller
                            control={control}
                            onFocus={() => {passwordRef.current.focus()}}
                            render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                secure={true}
                                ref={currentPasswordRef}
                                error={errors.old_password?.message}
                                onSubmitEditing={() => newPasswordRef.current.focus()}
                                containerStyle={{ marginBottom: Spacing.SPACING_3 }}
                                label='Current password'/>
                            )}
                            name="old_password"
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
                            onFocus={() => {passwordRef.current.focus()}}
                            render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                secure={true}
                                ref={newPasswordRef}
                                error={errors.password?.message}
                                onSubmitEditing={() => repeatPasswordRef.current.focus()}
                                containerStyle={{ marginBottom: Spacing.SPACING_3 }}
                                label='New password'/>
                            )}
                            name="new_password"
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
                            onFocus={() => {passwordRef.current.focus()}}
                            render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                secure={true}
                                ref={repeatPasswordRef}
                                error={errors.password?.message}
                                onSubmitEditing={() => handleSubmit(onSubmit)}
                                containerStyle={{ marginBottom: Spacing.SPACING_3 }}
                                label='Repeat password'/>
                            )}
                            name="repeat_password"
                            rules={{
                                required: true,
                                minLength: {
                                    value: 6,
                                    message: 'password must be at least 6'
                                }}
                            }
                            defaultValue=""
                        />
                    </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Save'}/>
        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    changePasswordScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    container: {
        flex: 1,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
        paddingHorizontal: Spacing.SPACING_5
    },
    title: {
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})

export default ChangePasswordScreen
