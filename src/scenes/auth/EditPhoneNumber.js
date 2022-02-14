import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import { Colors, Spacing, Typography } from "_styles";
import Container from '_components/atoms/Container'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { AuthStoreContext } from '_stores'
import TextField from "_atoms/TextField";
import { AuthHeaderText } from "_atoms/AuthHeaderText";
import { requiredValidation } from "_utils/validators";
import { visilabsApi } from "_utils/analytics";

const EditPhoneNumber = (props) => {
    const { control, handleSubmit, formState } = useForm({mode: 'onChange'});


    const [loading, setLoading] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    useEffect(() => {
        visilabsApi.customEvent('Edit-Phone-Number');
    },[])

    const onSubmit = (data) => {
        request(`/user/activate/sms.json`, {
            method: 'GET',
            data: {
                'phone': data.phone_number
            },
            success: function () {
                authStore.setUser({user: {...authStore.user, phone_number: data.phone_number}})
                props.navigation.goBack();
                setLoading(false)
            },
            error: (error) => {
                console.log('error', error);
                setLoading(false)
            }
        })
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <AuthHeaderText text={'Edit phone number'}/>
                    <Container style={{ flex: 1 }}>
                        <View style={ styles.register }>
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        keyboardType={'phone-pad'}
                                        ref={ref}
                                        placeholder={'New phone number'}
                                        error={formState.errors.phone_number?.message}
                                        onSubmitEditing={() => handleSubmit(onSubmit)}
                                        label='Phone number'/>
                                )}
                                name="phone_number"
                                rules={{ required: 'Confirmation code is required', pattern: requiredValidation}}
                                defaultValue=""
                            />
                        </View>
                        <View style={styles.footer}>
                            <Button
                                disabled={!formState.isValid}
                                loading={loading}
                                textStyle={styles.buttonTitle}
                                bodyStyle={styles.button}
                                onPress={handleSubmit(onSubmit)}
                                block={true}
                                type={'primary'}
                                text={'Save'}
                            />
                            <View style={styles.footerTextView}>
                                <Pressable onPress={() => {
                                    authStore.logout();
                                }}><Text style={styles.footerActionText}>Change Account</Text></Pressable>
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

export default EditPhoneNumber
