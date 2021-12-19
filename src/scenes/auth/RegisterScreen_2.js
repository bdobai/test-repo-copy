import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Linking,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import TextField from "_atoms/TextField";
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { requiredValidation } from "_utils/validators";
import { AuthHeaderText } from "_atoms/AuthHeaderText";
import { scaleSize } from "_styles/mixins";
import CheckBox from "_atoms/CheckBox";
import { genders } from "_utils/constants";
import countries from '_utils/countries.json';
import { AuthStoreContext } from "_stores";

const RegisterScreen_2 = (props) => {
    const { control, handleSubmit, setFocus, formState, } = useForm({mode: "onBlur"});

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => <Text style={styles.page}>2 of 3</Text>
        })
    },[])

    const [loading, setLoading] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    const onSubmit = data => {
        const params = props.route.params
        console.log('params', params)
        console.log('data', data)
        setLoading(true)
        props.navigation.navigate('Register_3');
        // request('/user/register.json', {
        //     method: 'POST',
        //     data: {
        //         "contact_consent": 3,
        //         "email_address": params.email,
        //         "password": params.password,
        //         "first_name": data.first_name,
        //         "last_name": data.last_name,
        //         "cedula": null,
        //         "terms": params.terms,
        //         "phone_number": {
        //             "code": data.country.phone_code,
        //             "number": data.phone
        //         },
        //         "country": data.country.country_id,
        //         "address1": null,
        //         "region": null,
        //         "city": null,
        //         "postal_code": null,
        //         "birthdate": dayjs(data.birthdate).unix(),
        //         "referral_code": null,
        //         "language": 3
        //     },
        //     withToken: false,
        //     success: function (response) {
        //         props.navigation.navigate('Register_3');
        //         loginAccount()
        //     },
        //     error: () => {
        //         setLoading(false)
        //     }
        // });
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
                    <AuthHeaderText text={'Register'}/>
                    <Container style={{ flex: 1, marginTop: Spacing.SPACING_5 }}>
                        <View style={ styles.login }>
                            <View style={styles.birthdayWrapper}>
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            styleInput={{width: '33%'}}
                                            inputWrapper={styles.year}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            maxLength={4}
                                            placeholder={'Year'}
                                            onSubmitEditing={() => setFocus('month')}
                                            ref={ref}
                                            error={formState.errors.year?.message}
                                            keyboardType={"phone-pad"}
                                            label='BIRTHDAY'/>
                                    )}
                                    name="year"
                                    rules={{ required: 'Year is required', pattern: requiredValidation}}
                                    defaultValue={''}
                                />
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            styleInput={{width: '33%'}}
                                            inputWrapper={styles.month}
                                            placeholder={'Month'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            maxLength={2}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            onSubmitEditing={() => setFocus('day')}
                                            ref={ref}
                                            error={formState.errors.month?.message}
                                            keyboardType={"phone-pad"}
                                            label={' '}
                                            />
                                    )}
                                    name="month"
                                    rules={{ required: 'Month is required', pattern: requiredValidation}}
                                    defaultValue={''}
                                />
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            styleInput={{width: '33%'}}
                                            inputWrapper={styles.day}
                                            placeholder={'Day'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            maxLength={2}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            onSubmitEditing={() => setFocus('phoneNumber')}
                                            ref={ref}
                                            error={formState.errors.day?.message}
                                            keyboardType={"phone-pad"}
                                            label={' '}/>
                                    )}
                                    name="day"
                                    rules={{ required: 'Day is required', pattern: requiredValidation}}
                                    defaultValue={''}
                                />
                            </View>
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        type={'phoneNumber'}
                                        placeholder={'Phone number'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={onBlur}
                                        onChangeText={value => {
                                            onChange(value)
                                        }}
                                        value={value}
                                        ref={ref}
                                        error={formState.errors.phoneNumber?.message}
                                        label='MOBILE NUMBER' />
                                )}
                                name="phoneNumber"
                                rules={{ required: 'Phone number is required', pattern: requiredValidation}}
                                defaultValue={{
                                    phone: '',
                                    countryDetails: {
                                        country_id: 222,
                                        code: "AE",
                                        phone_code: "971",
                                        name: "United Arab Emirates",
                                        flag_url: "https://s3.amazonaws.com/spoonity-flags/ae.png",
                                        zip_validate: "",
                                        phone_validate: "/^(5)([0-9]{8})$/"
                                    }
                                }}
                            />
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        type={'select'}
                                        items={genders}
                                        placeholder={'Gender'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        onSubmitEditing={() => setFocus('nationality')}
                                        ref={ref}
                                        error={formState.errors.gender?.message}
                                        label='GENDER'/>
                                )}
                                name="gender"
                                rules={{ required: 'Gender is required', pattern: requiredValidation}}
                                defaultValue={''}
                            />
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        type={'select'}
                                        items={countries}
                                        placeholder={'Nationality'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        onSubmitEditing={() => setFocus('email')}
                                        ref={ref}
                                        error={formState.errors.nationality?.message}
                                        label='NATIONALITY'/>
                                )}
                                name="nationality"
                                rules={{ required: 'Nationality is required', pattern: requiredValidation}}
                                defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { ref, onChange, onBlur, value } }) => (
                                <CheckBox onPress={() => onChange(!value)}
                                           checked={value}
                                           style={{borderColor: Colors.BLACK}}
                                           type={'square'}
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
                                 <CheckBox
                                           style={{borderColor: Colors.BLACK}}
                                           labelStyle={styles.checkBoxLabel}
                                           onPress={() => onChange(!value)}
                                           checked={value}
                                           label={'Yes, I agree to receiving news, exclusive offers and more from Costa Coffee.'}
                                           type={'square'}
                                 />
                               )}
                               name="newsletter"
                               defaultValue={false}
                             />
                            <View style={styles.footer}>
                                <Button
                                    disabled={false}
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
    },
    checkBoxLabel: {
        flex: 1,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    checkBoxLink: {
        flex: 1,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        fontWeight: '700',
        textDecorationLine:'underline'
    },
    birthdayWrapper: {
        flexDirection:'row'
    },
    year: {
        borderTopRightRadius:0,
        borderBottomRightRadius: 0
    },
    month: {
        borderRadius:0,
        borderLeftWidth:0,
        borderRightWidth:0,
    },
    day: {
        borderTopLeftRadius:0,
        borderBottomLeftRadius:0
    }
})

export default RegisterScreen_2


// import React, { useState } from 'react'
// import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View, Image } from 'react-native';
// import Header from '_components/molecules/Header'
// import { Colors, Typography } from '_styles'
// import Container from '_components/atoms/Container'
// import Button from '_components/atoms/Button'
// import { Controller, useForm } from 'react-hook-form'
// import { request } from '_utils/request'
// import { AuthStoreContext } from '_stores'
// import { scaleSize } from '_styles/mixins'
// import countries from '_utils/countries.json';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import dayjs from 'dayjs';
// import TextField from "_atoms/TextField";
//
// const RegisterScreen_2 = (props) => {
//     const { control, handleSubmit, setFocus, formState: { errors } } = useForm();
//
//     const [loading, setLoading] = useState(false);
//     const authStore = React.useContext(AuthStoreContext);
//
//     const onSubmit = data => {
//         const params = props.route.params
//
//         setLoading(true)
//         request('/user/register.json', {
//             method: 'POST',
//             data: {
//                 "contact_consent": 3,
//                 "email_address": params.email,
//                 "password": params.password,
//                 "first_name": data.first_name,
//                 "last_name": data.last_name,
//                 "cedula": null,
//                 "terms": params.terms,
//                 "phone_number": {
//                     "code": data.country.phone_code,
//                     "number": data.phone
//                 },
//                 "country": data.country.country_id,
//                 "address1": null,
//                 "region": null,
//                 "city": null,
//                 "postal_code": null,
//                 "birthdate": dayjs(data.birthdate).unix(),
//                 "referral_code": null,
//                 "language": 3
//             },
//             withToken: false,
//             success: function (response) {
//                 props.navigation.navigate('Register_3');
//                 loginAccount()
//             },
//             error: () => {
//                 setLoading(false)
//             }
//         });
//     };
//
//     const loginAccount = () => {
//         const params = props.route.params
//
//         request('/user/authenticate.json', {
//             method: 'POST',
//             data: {
//                 "email_address": params.email,
//                 "password": params.password,
//             },
//             withToken: false,
//             success: function (response) {
//                 console.log(response)
//                 AsyncStorage.setItem('online_order_token', response.online_order_token)
//                 AsyncStorage.setItem('session_key', response.session_identifier)
//                 setLoading(false)
//                 authStore.getUser()
//             },
//             error: () => {
//                 setLoading(false)
//             }
//         });
//     };
//
//     return <View style={{ flex: 1 }}>
//         <SafeAreaView style={ styles.signupScreen }>
//             <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
//                 <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
//                     <Container style={{ flex: 1 }}>
//                         <Header bg={false} center={<Text style={ styles.signupTitle }>SIGN UP 2/3</Text>} style={{marginTop: scaleSize(10)}}/>
//                         <View style={ styles.login } title={'Enter your credentials'}>
//                             <Controller
//                               control={control}
//                               render={({ field: { ref, onChange, onBlur, value } }) => (
//                                 <TextField
//                                   autoCorrect={false}
//                                   autoCapitalize={'none'}
//                                   onBlur={onBlur}
//                                   onChangeText={value => onChange(value)}
//                                   value={value}
//                                   onSubmitEditing={() => setFocus('last_name')}
//                                   ref={ref}
//                                   error={errors.name?.message}
//                                   label='First Name*'/>
//                               )}
//                               name="first_name"
//                               rules={{ required: 'First Name is required'}}
//                               defaultValue={''}
//                             />
//                             <Controller
//                               control={control}
//                               render={({ field: { ref, onChange, onBlur, value } }) => (
//                                 <TextField
//                                   autoCorrect={false}
//                                   autoCapitalize={'none'}
//                                   onBlur={onBlur}
//                                   onChangeText={value => onChange(value)}
//                                   value={value}
//                                   onSubmitEditing={() => setFocus('country')}
//                                   ref={ref}
//                                   error={errors.name?.message}
//                                   label='Last Name*'/>
//                               )}
//                               name="last_name"
//                               rules={{ required: 'Last Name is required'}}
//                               defaultValue={''}
//                             />
//                             <Controller
//                               control={control}
//                               render={({ field: { ref, onChange, onBlur, value } }) => (
//                                 <TextField
//                                   onBlur={onBlur}
//                                   onChangeText={value => onChange(value)}
//                                   value={value}
//                                   type={'select'}
//                                   items={countries}
//                                   itemKey={'country_id'}
//                                   onSubmitEditing={() => setFocus('phone')}
//                                   ref={ref}
//                                   error={errors.country?.message}
//                                   label='Country*'
//                                   renderRightAccessory={() => {
//                                       return <View style={{width: 40, height: 30}}><Image source={{uri: value.flag_url}} resizeMode={'contain'} style={{width: 30, height: 20}}/></View>
//                                   }}
//                                 />
//                               )}
//                               name="country"
//                               rules={{ required: 'Country is required'}}
//                               defaultValue={''}
//                             />
//                             <Controller
//                               control={control}
//                               render={({ field: { ref, onChange, onBlur, value } }) => (
//                                 <TextField
//                                   onBlur={onBlur}
//                                   onChangeText={value => onChange(value)}
//                                   value={value}
//                                   keyboardType={'phone-pad'}
//                                   onSubmitEditing={() => setFocus('birthdate')}
//                                   ref={ref}
//                                   error={errors.phone?.message}
//                                   label='Phone number*'/>
//                               )}
//                               name="phone"
//                               rules={{ required: 'Phone no. is required'}}
//                               defaultValue={''}
//                             />
//                             <Controller
//                               control={control}
//                               render={({ field: { ref, onChange, onBlur, value } }) => (
//                                 <TextField
//                                   onBlur={onBlur}
//                                   onChangeText={value => onChange(value)}
//                                   value={value}
//                                   type={'date'}
//                                   onSubmitEditing={() => handleSubmit(onSubmit)}
//                                   ref={ref}
//                                   error={errors.birthdate?.message}
//                                   label='Date of birth'/>
//                               )}
//                               name="birthdate"
//                               defaultValue={null}
//                             />
//                         </View>
//                         <View style={styles.footer}>
//                             <Button type={'secondary'}
//                                     loading={loading}
//                                     text={'Verify phone number'}
//                                     onPress={handleSubmit(onSubmit)}
//                             />
//                             <View style={styles.footerTextView}>
//                                 <Text style={styles.footerText}>Already have an account? </Text>
//                                 <Pressable onPress={() => props.navigation.navigate('Login')}><Text style={styles.footerActionText}>Log in</Text></Pressable>
//                             </View>
//                         </View>
//                     </Container>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     </View>
// }
//
//
// const styles = StyleSheet.create({
//     infoText: {
//         color: Colors.WHITE,
//         fontSize: Typography.FONT_SIZE_12,
//         lineHeight: Typography.LINE_HEIGHT_14,
//         fontFamily: Typography.FONT_PRIMARY_MEDIUM
//     },
//     footer: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         marginBottom: 20,
//     },
//     footerActionText: {
//         fontFamily: Typography.FONT_PRIMARY_BOLD,
//         fontSize: Typography.FONT_SIZE_12,
//         lineHeight: Typography.LINE_HEIGHT_14,
//         color: Colors.SECONDARY
//     },
//     footerText: {
//         color: Colors.WHITE,
//         fontFamily: Typography.FONT_PRIMARY_REGULAR,
//         fontSize: Typography.FONT_SIZE_12,
//         lineHeight: Typography.LINE_HEIGHT_14
//     },
//     footerTextView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 20
//     },
//     login: {
//         flex: 3,
//         justifyContent: 'center'
//     },
//     signupScreen: {
//         flex: 1,
//         backgroundColor: Colors.PRIMARY
//     },
//     signupTitle: {
//         fontFamily: Typography.FONT_PRIMARY_BOLD,
//         fontSize: Typography.FONT_SIZE_14,
//         lineHeight: Typography.LINE_HEIGHT_16,
//         color: Colors.SECONDARY
//     },
// })
//
// export default RegisterScreen_2
