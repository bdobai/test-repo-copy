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
import Logo from '_assets/images/logo_small_white.svg'
import countries from '_utils/countries.json';

const AccountInfoScreen = observer((props) => {
    const authStore = React.useContext(AuthStoreContext);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: authStore.user
    });

    const [loading, setLoading] = useState(false);

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
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('last_name')}
                            ref={ref}
                            error={errors.firstName?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3, marginTop: 30 }} label='First name'/>
                        )}
                        name="first_name"
                        rules={{ required: 'First name is required'}}
                    />
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('email_address')}
                            ref={ref}
                            error={errors.lastName?.message}
                            label='Last name'/>
                        )}
                        name="last_name"
                        rules={{ required: 'Last name is required'}}
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
                            keyboardType={'email-address'}
                            onSubmitEditing={() => passwordRef.current.focus()}
                            ref={ref}
                            error={errors.email?.message}
                            label='E-mail address'/>
                        )}
                        name="email_address"
                        rules={{ required: 'Email is required', pattern: emailValidator}}
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
                            secure={true}
                            ref={ref}
                            error={errors.password?.message}
                            onSubmitEditing={() => setFocus('address.country.name')}
                            label='Password*'/>
                        )}
                        name="password"
                        rules={{required: true}}
                        defaultValue=""
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
                            onSubmitEditing={() => setFocus('phone_number')}
                            ref={ref}
                            error={errors.phone?.message}
                            mask={"(+###)"}
                            label='Country*'
                            renderRightAccessory={() => {
                                return <View style={{width: 40, height: 30}}><Image source={{uri: value.flag_url}} resizeMode={'contain'} style={{width: 30, height: 20}}/></View>
                            }}
                            />
                        )}
                        name="address.country.name"
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
                            // mask={"+1 (###) ###-####"}
                            label='Phone no.'/>
                        )}
                        name="phone_number"
                        rules={{ required: 'Phone no. is required', pattern: phoneValidator}}
                    />
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => monthRef.current.focus()}
                            ref={ref}
                            error={errors.city?.message}
                            label='Date of birth'/>
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
