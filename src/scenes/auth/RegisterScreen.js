import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    Pressable,
    View,
    ActivityIndicator, Keyboard,
} from "react-native";
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
import SuccessIcon from '_assets/images/alerts/success.svg'
import ErrorIcon from '_assets/images/alerts/error.svg'
import { request } from "_utils/request";

const RegisterScreen = (props) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState(''); // success || error
    const [showValidation, setShowValidation] = useState(false);

    const { control, handleSubmit, setFocus, formState, getValues } = useForm({mode: "onChange"});

    useEffect(() => {
       props.navigation.setOptions({
           headerRight: () => <Text style={styles.page}>1 of 3</Text>
       })
    },[])

    const onSubmit = data => {
        props.navigation.navigate('Register_2', data);
    };

    const renderSecureTextButton = () => {
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

    const verifyEmail = () => {
        const email = getValues('email');
        if(!email?.length) return;
        setLoading(true)
        console.log('email', email);
        request('/user/email/exists.json', {
            method: 'GET',
            data: {
                email: email,
                vendor: 107430
            },
            withToken: false,
            success: function (response) {
                console.log('response', response);
                if(response.exists){
                    setEmailStatus('error');
                }else {
                    setEmailStatus('success');
                }
                setLoading(false)
            },
            error: (e) => {
                console.log('e', e);
                setLoading(false)
            }
        });
    }

    const renderEmailErrorMessage = () => {
        if(emailStatus!=='error') return;
        return (
            <View style={styles.emailErrorWrapper}>
                <ErrorIcon width={scaleSize(20)} height={scaleSize(20)} fill={Colors.ERROR} style={{marginRight: Spacing.SPACING_2}}/>
                <Text style={styles.emailError}>You are already registered for a Spoonity account with Costa Coffee UAE. Use the same password to login. If you can't remember your password,
                    <Text style={styles.link} onPress={() => props.navigation.navigate('Recover')}> reset it here</Text>
                </Text>
            </View>
        )
    }

    const renderRightAccessory = () => {
        if(loading) return <ActivityIndicator />
        if(!emailStatus) return;
        if(emailStatus==='success') return <SuccessIcon width={scaleSize(20)} height={scaleSize(20)} fill={Colors.WHITE} style={{backgroundColor:Colors.WHITE}} />
            return <ErrorIcon width={scaleSize(20)} height={scaleSize(20)} fill={Colors.ERROR}/>
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: scaleSize(20) }} bounces={false} showsVerticalScrollIndicator={false}>
                    <AuthHeaderText text={'Register'}/>
                    <Container style={{ flex: 1, marginTop: Spacing.SPACING_5 }}>
                        <View style={ styles.login }>
                            <View style={styles.namesWrapper}>
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            blurOnSubmit={false}
                                            styleInput={{width:'47%'}}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            placeholder={'First name'}
                                            onSubmitEditing={() => setFocus('last_name')}
                                            ref={ref}
                                            error={formState.errors.first_name?.message}
                                            label='FIRST NAME'/>
                                    )}
                                    name="first_name"
                                    rules={{ required: 'First name is required', pattern: requiredValidation}}
                                    defaultValue={''}
                                />
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            blurOnSubmit={false}
                                            styleInput={{width:'47%'}}
                                            placeholder={'Last name'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            onSubmitEditing={() => setFocus('email')}
                                            ref={ref}
                                            error={formState.errors.last_name?.message}
                                            label='LAST NAME'/>
                                    )}
                                    name="last_name"
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
                                        onBlur={() => {
                                            onBlur();
                                            verifyEmail();
                                        }}
                                        placeholder={'Email'}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        keyboardType={'email-address'}
                                        onSubmitEditing={() => setFocus('confirmEmail')}
                                        ref={ref}
                                        error={formState.errors.email?.message}
                                        rightAccessory={() => <View style={styles.securePasswordWrapper}>{renderRightAccessory()}</View>}
                                        label='EMAIL'/>
                                )}
                                name="email"
                                rules={{ required: 'Email is required', pattern: emailValidator}}
                                defaultValue={props.route.params ? props.route.params.email : ''}
                            />
                            {renderEmailErrorMessage()}
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
                                  rightAccessory={renderSecureTextButton}
                                  onSubmitEditing={Keyboard.dismiss}
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
    },
    emailErrorWrapper: {
        flexDirection: 'row',
        marginBottom: Spacing.SPACING_5,
    },
    emailError:{
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: '#617582',
        flex:1
    },
    link: {
        fontWeight: '700'
    },
    errorMessage: {
        alignSelf: 'center',
        color: Colors.ERROR,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        marginBottom: Spacing.SPACING_5,
    },
})

export default RegisterScreen
