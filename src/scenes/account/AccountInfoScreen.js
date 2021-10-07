import React, { Component, useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View, Image, Pressable, Text, Keyboard } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { AuthStoreContext } from '_stores'
import { emailValidator, phoneValidator } from '_utils/validators'
import { request } from '_utils/request'
import { observer } from 'mobx-react-lite'
import BackButton from '_atoms/BackButton'
import Logo from '_assets/images/logo_2.svg'

const AccountInfoScreen = observer((props) => {
    const authStore = React.useContext(AuthStoreContext);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: authStore.user
    });

    const firstNameRef = React.useRef()
    const lastNameRef = React.useRef()
    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const countryRef = React.useRef()
    const phoneRef = React.useRef()
    const dayRef = React.useRef()
    const monthRef = React.useRef()
    const yearRef = React.useRef()

    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState([]);

    const getCounties = () => {
        request('/country/list.json', {
            method: 'GET',
            success: function (response) {
                setCountry(response.map((item) => {
                    return {
                        key: item.country_id,
                        value: item.phone_code,
                        label: item.name,
                        flag: item.flag_url
                    }
                }))
            }
        });
    }

    useEffect(() => {
        getCounties();
    }, []);

    const onSubmit = data => {
        Keyboard.dismiss();
        setLoading(true)

        let formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
   
        request('/user/profile.json', {
            method: 'PUT',
            data: formData,
            success: function (response) {
                setLoading(false);
                authStore.getUser();
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    const actionSheetRef = React.useRef();


    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={styles.accountInfoScreen}>
        <Header
          left={<BackButton/>}
          center={<Logo style={ styles.logo }/>}
        />
        <Text style={styles.title}>PERSONAL INFORMATION</Text>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <Controller
                        control={control}
                        onFocus={() => {firstNameRef.current.focus()}}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => lastNameRef.current.focus()}
                            ref={firstNameRef}
                            error={errors.firstName?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3, marginTop: 30 }} label='First name'/>
                        )}
                        name="first_name"
                        rules={{ required: 'First name is required'}}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {lastNameRef.current.focus()}}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => emailRef.current.focus()}
                            ref={lastNameRef}
                            error={errors.lastName?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Last name'/>
                        )}
                        name="last_name"
                        rules={{ required: 'Last name is required'}}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {emailRef.current.focus()}}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            keyboardType={'email-address'}
                            onSubmitEditing={() => passwordRef.current.focus()}
                            ref={emailRef}
                            error={errors.email?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='E-mail address'/>
                        )}
                        name="email_address"
                        rules={{ required: 'Email is required', pattern: emailValidator}}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {passwordRef.current.focus()}}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            secure={true}
                            ref={passwordRef}
                            error={errors.password?.message}
                            onSubmitEditing={() => countryRef.current.focus()}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Password*'/>
                        )}
                        name="password"
                        rules={{required: true}}
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        onFocus={() => {countryRef.current.focus()}}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => phoneRef.current.focus()}
                            ref={countryRef}
                            error={errors.phone?.message}
                            mask={"(+###)"}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Country*'/>
                        )}
                        name="address.country.name"
                        rules={{ required: 'Country is required'}}
                        defaultValue={''}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {phoneRef.current.focus()}}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            keyboardType={'phone-pad'}
                            onSubmitEditing={() => dayRef.current.focus()}
                            ref={phoneRef}
                            error={errors.phone?.message}
                            mask={"+1 (###) ###-####"}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Phone no.'/>
                        )}
                        name="phone_number"
                        rules={{ required: 'Phone no. is required', pattern: phoneValidator}}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {dayRef.current.focus()}}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => monthRef.current.focus()}
                            ref={dayRef}
                            error={errors.city?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Date of birth'/>
                        )}
                        name="birthdate"
                    />
                </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Save'}/>
            {/* This needs to be moved inside password input */}
            <Pressable onPress={() => props.navigation.navigate('AccountSettings.ChangePassword')}>
                <Text style={{color: Colors.SECONDARY}}>Change password</Text>
            </Pressable>
        </View>
    </KeyboardAvoidingView>

});

const styles = StyleSheet.create({
    accountInfoScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    container: {
        flex: 1,
    },
    col1: {
        position: 'relative',
        flex: 1,
        marginRight: Spacing.SPACING_2,
        overflow: 'hidden',
    },
    col2: {
        position: 'relative',
        flex: 1,
        marginLeft: Spacing.SPACING_3,
        overflow: 'hidden',
    },
    col3: {
        position: 'relative',
        flex: 1,
        marginLeft: Spacing.SPACING_3,
        overflow: 'hidden',
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
        paddingHorizontal: Spacing.SPACING_5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})

export default AccountInfoScreen
