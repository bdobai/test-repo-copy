import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import TextField from "_atoms/TextField";
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import {
    dayValidator,
    monthValidator,
    phoneNumberValidator,
    requiredValidation,
    yearValidator,
} from "_utils/validators";
import { AuthHeaderText } from "_atoms/AuthHeaderText";
import { scaleSize } from "_styles/mixins";
import CheckBox from "_atoms/CheckBox";
import { genders } from "_utils/constants";
import countries from '_utils/countries.json';
import { AuthStoreContext } from "_stores";
import dayjs from "dayjs";
import { request } from "_utils/request";

const RegisterScreen_2 = (props) => {
    const { control, handleSubmit, setFocus, formState, } = useForm({mode: "onChange"});

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => <Text style={styles.page}>2 of 3</Text>
        })
    },[])

    const [loading, setLoading] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    const onSubmit = data => {
        const params = props.route.params
        setLoading(true)
        const body = {
            "contact_consent": data.newsletter ? 3 : 2,
            "email_address": params.email,
            "email_address_duplicate": params.email,
            "password": params.password,
            "first_name": params.first_name,
            "last_name": params.last_name,
            "terms": data.terms,
            "phone_number": {
                "code": '+971', // +40
                "number": data.phone_number
            },
            "country": data.nationality.country_id,
            "birth_day": +data.day,
            "birth_month": +data.month,
            "birth_year": data.year,
            "birthdate": dayjs(`${data.year}-${data.month}-${data.day}`).unix(),
            "language": 1,
            "vendor": 107430
        }
        console.log('body', body)
        request('/user/register.json', {
            method: 'POST',
            data: body,
            withToken: false,
            success: function () {
                props.navigation.navigate('Register_3', {email: params.email});
                loginAccount()
            },
            error: (e)=> {
                setLoading(false)
                console.log('error', e.error);
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

    const renderFlag = () => {
        return <View style={styles.flag}>
            <Image resizeMode={'contain'} style={styles.flagIcon} source={{uri: 'https://s3.amazonaws.com/spoonity-flags/ae.png'}}/>
            <TextInput editable={false} value={`(+971)`} allowFontScaling={false} style={styles.prefix}/>
        </View>
    }

    const onTermsOfService = () => {
        props.navigation.navigate('Terms', {code:'terms'})
    }

    const onPrivacyPolicy = () => {
        props.navigation.navigate('Privacy', {code:'terms'})
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView style={ styles.signupScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: scaleSize(20) }} bounces={false} showsVerticalScrollIndicator={false}>
                    <AuthHeaderText text={'Register'}/>
                    <Container style={{ flex: 1, marginTop: Spacing.SPACING_5 }}>
                        <View style={ styles.login }>
                            <View style={styles.birthdayWrapper}>
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            blurOnSubmit={false}
                                            styleInput={{width: '33.3%'}}
                                            inputWrapper={styles.day}
                                            placeholder={'DD'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            maxLength={2}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            onSubmitEditing={() => setFocus('month')}
                                            ref={ref}
                                            error={formState.errors.day?.message}
                                            keyboardType={"phone-pad"}
                                            label={'BIRTHDATE'}
                                            />
                                    )}
                                    name="day"
                                    rules={{ required: 'Day is required', pattern: dayValidator}}
                                    defaultValue={''}
                                />
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            blurOnSubmit={false}
                                            styleInput={{width: '33.3%'}}
                                            inputWrapper={styles.month}
                                            placeholder={'MM'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            maxLength={2}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            onSubmitEditing={() => setFocus('year')}
                                            ref={ref}
                                            error={formState.errors.month?.message}
                                            keyboardType={"phone-pad"}
                                            label={' '}
                                            />
                                    )}
                                    name="month"
                                    rules={{ required: 'Month is required', pattern: monthValidator}}
                                    defaultValue={''}
                                />
                                <Controller
                                    control={control}
                                    render={({ field: { ref, onChange, onBlur, value } }) => (
                                        <TextField
                                            blurOnSubmit={false}
                                            styleInput={{width: '33.3%'}}
                                            inputWrapper={styles.year}
                                            placeholder={'YYYY'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            onBlur={onBlur}
                                            maxLength={4}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            onSubmitEditing={() => setFocus('phone_number')}
                                            ref={ref}
                                            error={formState.errors.year?.message}
                                            keyboardType={"phone-pad"}
                                            label={' '}
                                        />
                                    )}
                                    name="year"
                                    rules={{ required: 'Year is required', pattern: yearValidator}}
                                    defaultValue={''}
                                />
                            </View>
                            <Controller
                                control={control}
                                render={({ field: { ref, onChange, onBlur, value } }) => (
                                    <TextField
                                        leftAccessory={renderFlag}
                                        placeholder={'Phone number'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        onBlur={onBlur}
                                        onChangeText={value => {
                                            onChange(value)
                                        }}
                                        value={value}
                                        ref={ref}
                                        blurOnSubmit={true}
                                        error={formState.errors.phone_number?.message}
                                        keyboardType={"phone-pad"}
                                        label='MOBILE NUMBER' />
                                )}
                                name="phone_number"
                                rules={{ required: 'Phone number is required', pattern: phoneNumberValidator}}
                                defaultValue={''}
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
                                rules={{ required: false}}
                                defaultValue={''}
                            />
                            <Controller
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <CheckBox onPress={() => onChange(!value)}
                                           checked={value}
                                           style={{borderColor: Colors.BLACK}}
                                           type={'square'}
                                 >
                                     <View style={{ flex: 1 }}>
                                         <Text style={styles.checkBoxLabel}>I have read and agree to the <Text style={styles.checkBoxLink} onPress={onTermsOfService}>Terms of Service</Text> and <Text style={styles.checkBoxLink} onPress={onPrivacyPolicy}>Privacy Policy</Text></Text>
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
                                    disabled={!formState.isValid}
                                    loading={loading}
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
        flexDirection:'row',
    },
    day: {
        borderTopRightRadius:0,
        borderBottomRightRadius:0,
    },
    month: {
        borderRadius:0,
        borderLeftWidth:1,
        borderRightWidth:1,
    },
    year:{
        borderTopLeftRadius:0,
        borderBottomLeftRadius:0,
    },
    flag: {
        flexDirection:'row',
        alignItems:'center',
        paddingLeft: scaleSize(15),
    },
    flagIcon:{
        width:scaleSize(30),
        height: scaleSize(20)
    },
    prefix:{
        marginLeft: Spacing.SPACING_1,
        color: Colors.BLACK,
        paddingVertical:scaleSize(5)
    }
})

export default RegisterScreen_2
