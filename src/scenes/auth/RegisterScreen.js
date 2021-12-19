import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import TextField from "_atoms/TextField";
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { emailValidator, requiredValidation } from "_utils/validators";
import { AuthHeaderText } from "_atoms/AuthHeaderText";
import { scaleSize } from "_styles/mixins";
import { passwordValidators } from "_utils/constants";
import { PasswordValidationMessage } from "_atoms/PasswordValidationMessage";

const RegisterScreen = (props) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [password, setPassword] = useState('');
    const [showValidation, setShowValidation] = useState(false);
    const { control, handleSubmit, setFocus, formState, } = useForm({mode: "onBlur"});

    useEffect(() => {
       props.navigation.setOptions({
           headerRight: () => <Text style={styles.page}>1 of 3</Text>
       })
    },[])

    const onSubmit = data => {
        props.navigation.navigate('Register_2', data);
    };

    const renderRightAccessory = () => {
        return <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.securePasswordWrapper}>
            <Text style={styles.securePassword}>{!secureTextEntry ? 'HIDE' : 'SHOW'}</Text>
        </Pressable>
    }

    const renderCustomError = () => {
        if(!showValidation) return
        return passwordValidators.map((item) => {
            return <PasswordValidationMessage key={item.label} label={item.label} validator={item.validator} value={password}/>
        })
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <AuthHeaderText text={'Register'}/>
                    <Container style={{ flex: 1, marginTop: Spacing.SPACING_5 }}>
                        <View style={ styles.login }>
                            <View style={styles.namesWrapper}>
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            styleInput={{width:'47%'}}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            placeholder={'First name'}
                                            onSubmitEditing={() => setFocus('lastName')}
                                            ref={ref}
                                            error={formState.errors.firstName?.message}
                                            label='FIRST NAME'/>
                                    )}
                                    name="firstName"
                                    rules={{ required: 'First name is required', pattern: requiredValidation}}
                                    defaultValue={''}
                                />
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            styleInput={{width:'47%'}}
                                            placeholder={'Last name'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            onSubmitEditing={() => setFocus('email')}
                                            ref={ref}
                                            error={formState.errors.lastName?.message}
                                            label='LAST NAME'/>
                                    )}
                                    name="lastName"
                                    rules={{ required: 'Last name is required', pattern: requiredValidation}}
                                    defaultValue={''}
                                />
                            </View>
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={onBlur}
                                        placeholder={'Email'}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        keyboardType={'email-address'}
                                        onSubmitEditing={() => setFocus('confirmEmail')}
                                        ref={ref}
                                        error={formState.errors.email?.message}
                                        label='EMAIL'/>
                                )}
                                name="email"
                                rules={{ required: 'Email is required', pattern: emailValidator}}
                                defaultValue={props.route.params ? props.route.params.email : ''}
                            />
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={onBlur}
                                        placeholder={'Confirm email'}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        keyboardType={'email-address'}
                                        onSubmitEditing={() => setFocus('password')}
                                        ref={ref}
                                        error={formState.errors.confirmEmail?.message}
                                        label='CONFIRM EMAIL'/>
                                )}
                                name="confirmEmail"
                                rules={{ required: 'Emails are not the same', pattern: emailValidator}}
                                defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => {
                                      onChange(value);
                                      setPassword(value);
                                  }}
                                  value={value}
                                  ref={ref}
                                  placeholder={'6 characters, 1 lowercase, 1 capital, 1 number'}
                                  error={formState.errors.password?.message}
                                  customError={renderCustomError}
                                  secureTextEntry={secureTextEntry}
                                  rightAccessory={renderRightAccessory}
                                  onSubmitEditing={() => setFocus('confirm_password')}
                                  onFocus={() =>setShowValidation(true)}
                                  label='PASSWORD'/>
                              )}
                              name="password"
                              rules={{
                                  required: true,
                                  pattern: {
                                      value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/i,
                                      message: 'Password must include 1 lowercase, 1 capital, 1 number'
                                  },
                                  minLength: {
                                      value: 6,
                                      message: 'password must be at least 6'
                                  }}
                              }
                              defaultValue=""
                            />
                            <View style={styles.footer}>
                                <Button
                                    disabled={!formState.isValid}
                                    textStyle={styles.buttonTitle}
                                    bodyStyle={styles.button}
                                    onPress={handleSubmit(onSubmit)}
                                    block={true}
                                    type={'primary'}
                                    text={'NEXT'}
                                />
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
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM
    },
    footer: {
        flex: 1,
        alignItems: 'center',
    },
    footerActionText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        color: Colors.SECONDARY
    },
    login: {
        flex: 1,
    },
    namesWrapper: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%'
    },
    signupScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    signupTitle: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.SECONDARY
    },
    button: {
        width:'100%',
        height: scaleSize(60),
        borderRadius: scaleSize(30),
        marginTop: Spacing.SPACING_5
    },
    buttonTitle: {
        fontSize: Typography.FONT_SIZE_20
    },
    securePasswordWrapper:{
        justifyContent:'center',
        marginRight: scaleSize(20)
    },
    securePassword: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_SECONDARY_REGULAR,
        color: Colors.GRAY_DARK,
        fontWeight: '600',
        letterSpacing: 0
    },
    page: {
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontSize: Typography.FONT_SIZE_20,
        color: Colors.PRIMARY,
        marginRight: Spacing.SPACING_1,
        fontWeight: '700',
    }
})

export default RegisterScreen
