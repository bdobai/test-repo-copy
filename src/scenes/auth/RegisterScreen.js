import React from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View, Linking } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { emailValidator } from '_utils/validators'
import { scaleSize } from '_styles/mixins'
import CheckBox from '_components/atoms/CheckBox'

const RegisterScreen = (props) => {
    const { control, handleSubmit, setFocus, formState: { errors } } = useForm();

    const onSubmit = data => {
        props.navigation.navigate('Register_2', data);
    };

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <Container style={{ flex: 1 }}>
                        <Header bg={false} center={<Text style={ styles.signupTitle }>SIGN UP 1/3</Text>} style={{marginTop: scaleSize(10)}}/>
                        <View style={ styles.login } title={'Enter your credentials'}>
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  autoCorrect={false}
                                  autoCapitalize={'none'}
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  keyboardType={'email-address'}
                                  onSubmitEditing={() => setFocus('password')}
                                  ref={ref}
                                  error={errors.email?.message}
                                  label='E-mail*'/>
                              )}
                              name="email"
                              rules={{ required: 'Email is required', pattern: emailValidator}}
                              defaultValue={props.route.params ? props.route.params.email : ''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secure={true}
                                  ref={ref}
                                  error={errors.password?.message}
                                  onSubmitEditing={() => setFocus('confirm_password')}
                                  label='Password*'/>
                              )}
                              name="password"
                              rules={{
                                  required: true,
                                  pattern: /^[A-Za-z0-9]+$/i,
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
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  secure={true}
                                  title={'At least 6 characters (including 1 lowercase, 1 capital, 1 number)'}
                                  ref={ref}
                                  error={errors.confirm_password?.message}
                                  label='Confirm password*'/>
                              )}
                              name="confirm_password"
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
                                <CheckBox onPress={() => onChange(!value)}
                                          error={errors.confirm_password?.message}
                                          checked={value}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.checkBoxLabel}>I have read and agree to the <Text style={styles.checkBoxLink} onPress={() => Linking.openURL("https://google.com")}>Terms of Service and Privacy Policy</Text></Text>

                                    </View>
                                </CheckBox>
                              )}
                              name="terms"
                              rules={{
                                  required: true,
                              }}
                              defaultValue={false}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <CheckBox onPress={() => onChange(!value)}
                                          checked={value}
                                          label={'Yes, I agree to receiving news, exclusive offers and more from Costa Coffee.'}
                                />
                              )}
                              name="newsletter"
                              defaultValue={false}
                            />
                        </View>
                        <View style={styles.footer}>
                            <Button type={'secondary'}
                                text={'Next'}
                                onPress={handleSubmit(onSubmit)}
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
        marginBottom: Spacing.SPACING_4,
    },
    footerActionText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        color: Colors.SECONDARY
    },
    footerText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14
    },
    footerTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.SPACING_4
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
    checkBoxLabel: {
        flex: 1,
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    checkBoxLink: {
        flex: 1,
        color: Colors.SECONDARY,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
})

export default RegisterScreen
