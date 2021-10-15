import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import Header from '_components/molecules/Header'
import { Colors, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { AuthStoreContext } from '_stores'
import { phoneValidator } from '_utils/validators'
import { scaleSize } from '_styles/mixins'
import countries from '_utils/countries.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const RegisterScreen_2 = (props) => {
    const { control, handleSubmit, setFocus, formState: { errors } } = useForm();

    const [loading, setLoading] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    const onSubmit = data => {
        const params = props.route.params

        setLoading(true)
        request('/user/register.json', {
            method: 'POST',
            data: {
                "contact_consent": 3,
                "email_address": params.email,
                "password": params.password,
                "first_name": data.first_name,
                "last_name": data.last_name,
                "cedula": null,
                "terms": params.terms,
                "phone_number": {
                    "code": data.country.phone_code,
                    "number": data.phone
                },
                "country": data.country.country_id,
                "address1": null,
                "region": null,
                "city": null,
                "postal_code": null,
                "birthdate": dayjs(data.birthdate).unix(),
                "referral_code": null,
                "language": 3
            },
            withToken: false,
            success: function (response) {
                props.navigation.navigate('Register_3');
                loginAccount()
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    const loginAccount = () => {
        const params = props.route.params

        request('/user/authenticate.json', {
            method: 'POST',
            data: {
                "email_address": params.email,
                "password": params.password,
            },
            withToken: false,
            success: function (response) {
                console.log(response)
                AsyncStorage.setItem('online_order_token', response.online_order_token)
                AsyncStorage.setItem('session_key', response.session_identifier)
                setLoading(false)
                authStore.getUser()
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                    <Container style={{ flex: 1 }}>
                        <Header bg={false} center={<Text style={ styles.signupTitle }>SIGN UP 2/3</Text>} style={{marginTop: scaleSize(10)}}/>
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
                                  onSubmitEditing={() => setFocus('last_name')}
                                  ref={ref}
                                  error={errors.name?.message}
                                  label='First Name*'/>
                              )}
                              name="first_name"
                              rules={{ required: 'First Name is required'}}
                              defaultValue={''}
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
                                  onSubmitEditing={() => setFocus('country')}
                                  ref={ref}
                                  error={errors.name?.message}
                                  label='Last Name*'/>
                              )}
                              name="last_name"
                              rules={{ required: 'Last Name is required'}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  type={'select'}
                                  items={countries}
                                  itemKey={'country_id'}
                                  onSubmitEditing={() => setFocus('phone')}
                                  ref={ref}
                                  error={errors.country?.message}
                                  label='Country*'
                                  renderRightAccessory={() => {
                                      return <View style={{width: 40, height: 30}}><Image source={{uri: value.flag_url}} resizeMode={'contain'} style={{width: 30, height: 20}}/></View>
                                  }}
                                />
                              )}
                              name="country"
                              rules={{ required: 'Country is required'}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  keyboardType={'phone-pad'}
                                  onSubmitEditing={() => setFocus('birthdate')}
                                  ref={ref}
                                  error={errors.phone?.message}
                                  mask={"+1 (###) ###-####"}
                                  label='Phone number*'/>
                              )}
                              name="phone"
                              rules={{ required: 'Phone no. is required'}}
                              defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                  onBlur={onBlur}
                                  onChangeText={value => onChange(value)}
                                  value={value}
                                  type={'date'}
                                  onSubmitEditing={() => handleSubmit(onSubmit)}
                                  ref={ref}
                                  error={errors.birthdate?.message}
                                  label='Date of birth'/>
                              )}
                              name="birthdate"
                              defaultValue={null}
                            />
                        </View>
                        <View style={styles.footer}>
                            <Button type={'secondary'}
                                    // loading={loading}
                                    text={'Verify phone number'}
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
        marginBottom: 20,
    },
    footerActionText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
        color: Colors.SECONDARY
    },
    footerText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14
    },
    footerTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
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
})

export default RegisterScreen_2
