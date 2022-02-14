import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Keyboard,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import TextField from "_atoms/TextField";
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { scaleSize } from "_styles/mixins";
import { passwordValidators } from "_utils/constants";
import { PasswordValidationMessage } from "_atoms/PasswordValidationMessage";
import SectionTitle from "_atoms/SectionTitle";
import { visilabsApi } from "_utils/analytics";

const NewPasswordScreen = (props) => {
    const [password, setPassword] = useState('');
    const [passwordsError, setPasswordErrors] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

    const { control, handleSubmit, setFocus, formState, getValues } = useForm({mode: "onChange"});

    useEffect(() => {
        visilabsApi.customEvent('New-Password');
    },[])

    const onSubmit = data => {
        const confirmPassword = getValues('repeat_password');
        if(password !== confirmPassword) {
            Keyboard.dismiss()
            return setPasswordErrors(true);
        }else {
            props.navigation.navigate('AccountSettings.OldPassword', data);
            setPasswordErrors(false);
        }
    };

    const renderCustomError = () => {
        if(!showValidation) return
        return passwordValidators.map((item) => {
            return <PasswordValidationMessage key={item.label} label={item.label} validator={item.validator} value={password}/>
        })
    }

    const renderError = () => {
        if(!passwordsError) return;
        return <Text style={styles.errorMessage}>The passwords do not match</Text>
    }

    const onBlurConfirmPassword = () => {
        const confirmPassword = getValues('repeat_password');
        if(password !== confirmPassword) {
            setPasswordErrors(true);
        }else {
            setPasswordErrors(false);
        }
    }

    return <View style={styles.screen}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <SectionTitle textStyle={styles.title}>Change My Password</SectionTitle>
                    <Container style={{ flex: 1, marginTop: Spacing.SPACING_5 }}>
                        <View style={ styles.login }>
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
                                        secureTextEntry={true}
                                        placeholder={'******'}
                                        error={formState.errors.password?.message}
                                        onSubmitEditing={() => setFocus('repeat_password')}
                                        onFocus={() =>setShowValidation(true)}
                                        label='NEW PASSWORD'/>
                                )}
                                name="password"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={() => {
                                            onBlur()
                                            onBlurConfirmPassword()
                                        }}
                                        secureTextEntry={true}
                                        placeholder={'******'}
                                        onChangeText={onChange}
                                        value={value}
                                        customError={renderCustomError}
                                        onSubmitEditing={Keyboard.dismiss}
                                        ref={ref}
                                        error={formState.errors.repeat_password?.message}
                                        label='REPEAT PASSWORD'/>
                                )}
                                name="repeat_password"
                                rules={{ required: true}}
                                defaultValue={''}
                            />
                            {renderError()}
                        </View>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        <View style={styles.floatingButton}>
            <Button
                textStyle={{fontSize: scaleSize(24)}}
                bodyStyle={{width: scaleSize(120)}}
                onPress={handleSubmit(onSubmit)}
                block={true}
                type={'primary'}
                text={'Save'}
                disabled={passwordsError || !formState.isValid}
            />
        </View>
    </View>
}

const styles = StyleSheet.create({
    login: {
        flex: 1,
    },
    namesWrapper: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%'
    },
    screen: {
        flex: 1,
        backgroundColor: Colors.WHITE
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
    errorMessage: {
        color: Colors.ERROR,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        marginBottom: Spacing.SPACING_5,
        marginTop: -Spacing.SPACING_2
    },
    floatingButton: {
        position:'absolute',
        bottom: scaleSize(30),
        right: scaleSize(10),
    },
    title: {
        fontSize: Typography.FONT_SIZE_22,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.BLACK,
        fontWeight:'700',
        marginLeft: Spacing.SPACING_5
    }
})

export default NewPasswordScreen
