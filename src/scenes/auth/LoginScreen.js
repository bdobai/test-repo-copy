import React, { useCallback, useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    Pressable,
    View,
    ScrollView,
    StatusBar,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import Button from '_components/atoms/Button'
import { useForm, Controller } from "react-hook-form";
import { request } from '_utils/request'
import { emailValidator } from '_utils/validators'
import { AuthStoreContext } from '_stores'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextField from "_atoms/TextField";
import { scaleSize } from "_styles/mixins";
import { AuthHeaderText } from "_atoms/AuthHeaderText";
import { isIphone } from "_utils/helpers";
import { useFocusEffect } from "@react-navigation/native";
import { visilabsApi } from "_utils/analytics";

const LoginScreen = (props) => {
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            StatusBar.setBarStyle('dark-content')
            if(!isIphone()){
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor(Colors.WHITE);
            }
        });

        return unsubscribe;
    }, [props.navigation]);

    const { control, handleSubmit, setFocus, formState, getValues, setValue } = useForm({ mode: "onChange" });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const authStore = React.useContext(AuthStoreContext);

    useFocusEffect(
        useCallback(() => {
            if(props.route.params?.email) {
                setValue('email', props.route.params.email);
            }
        }, [props.navigation])
    );

    const onSubmit = data => {
        setLoading(true)
        request('/user/authenticate.json', {
            method: 'POST',
            data: {
                "email_address": data.email,
                "password": data.password,
              },
            withToken: false,
            success: async function(response) {
                AsyncStorage.setItem('online_order_token', response.online_order_token)
                AsyncStorage.setItem('session_key', response.session_identifier)
                authStore.getUser();
                setLoading(false)
                let userData = {
                    "OM.exVisitorID": response?.user_vendor?.user?.id || '1',
                    "OM.b_login": "1"
                };
                visilabsApi.customEvent("Login", userData);
            },
            error: (e) => {
                setLoading(false)
                setError(e.error?.errors[0]?.message)
            }
        });
    };

    const renderError = () => {
        if(!error) return;
        return <Text style={styles.errorMessage}>{error}</Text>
    }

    const renderRightAccessory = () => {
        return <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.securePasswordWrapper}>
            <Text style={styles.securePassword}>{!secureTextEntry ? 'HIDE' : 'SHOW'}</Text>
        </Pressable>
    }

    const onForgotPassword = () => {
        const email = getValues('email')
        props.navigation.navigate('Recover', {email})
    }

    return <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <SafeAreaView style={{ flex: 1}}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} >
                    <SafeAreaView style={ styles.loginScreen }>
                        <AuthHeaderText text={'Log in'}/>
                        <View style={ styles.login }>
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  placeholder={'Email'}
                                  autoCorrect={false}
                                  autoComplete={'email'}
                                  autoCapitalize={'none'}
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  textContentType={'emailAddress'}
                                  keyboardType={'email-address'}
                                  onSubmitEditing={() => setFocus('password')}
                                  error={formState?.errors?.email?.message}
                                  ref={ref}
                                  label='EMAIL'/>
                              )}
                              name="email"
                              rules={{ required: 'Email is required', pattern: emailValidator}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  placeholder={'Password'}
                                  autoCorrect={false}
                                  autoComplete={'password'}
                                  autoCapitalize={'none'}
                                  onBlur={onBlur}
                                  textContentType={'password'}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secureTextEntry={secureTextEntry}
                                  ref={ref}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  rightAccessory={renderRightAccessory}
                                  label='PASSWORD'/>
                              )}
                              name="password"
                              rules={{
                                  required: true,
                                  minLength: {
                                      value: 6,
                                      message: 'password must be at least 6'
                                  }}
                              }
                              defaultValue=""
                            />
                            <View style={styles.forgot}>
                                <Text style={styles.forgotText}>Forgot your password ?</Text>
                                <Pressable onPress={onForgotPassword}><Text style={[styles.forgotText, {textDecorationLine:'underline'}]}> Click here to reset it</Text></Pressable>
                            </View>
                            {renderError()}
                            <View style={styles.footer}>
                                <Button disabled={!formState.isValid} bodyStyle={styles.button} loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'LOG IN'}/>
                            </View>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        alignItems: 'center',
    },
    forgotText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontWeight: '500'
    },
    forgot: {
        flexDirection: 'row',
        marginBottom: Spacing.SPACING_5
    },
    login: {
        flex: 1,
    },
    loginScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingHorizontal: Spacing.SPACING_5,
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
    errorMessage: {
        alignSelf: 'center',
        color: Colors.ERROR,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
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
    }
})

export default LoginScreen
