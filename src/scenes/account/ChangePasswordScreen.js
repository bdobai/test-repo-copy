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
import Logo from '_assets/images/logo_small_white.svg'
import { AuthStoreContext } from '_stores'

const ChangePasswordScreen = (props) => {
    const { control, handleSubmit, setFocus, formState: { errors } } = useForm();
    const authStore = React.useContext(AuthStoreContext);

    const [loading, setLoading] = useState(false);

    const onSubmit = data => {
        setLoading(true)
        request('/user/profile.json', {
            method: 'PUT',
            data: {
                current_password: data.old_password,
                password: data.new_password,
            },
            success: function (response) {
                setLoading(false);
                authStore.logout();
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
                            render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                secure={true}
                                ref={ref}
                                error={errors.old_password?.message}
                                onSubmitEditing={() => setFocus('new_password')}
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
                                onSubmitEditing={() => setFocus('repeat_password')}
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
