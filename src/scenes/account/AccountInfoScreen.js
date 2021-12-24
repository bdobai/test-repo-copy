import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
    Image,
    Pressable,
    Text,
    Keyboard,
    TextInput,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { AuthStoreContext } from '_stores'
import { emailValidator, phoneValidator } from '_utils/validators'
import { request } from '_utils/request'
import { observer } from 'mobx-react-lite'
import SectionTitle from '_atoms/SectionTitle';
import TextField from "_atoms/TextField";
import { scaleSize } from "_styles/mixins";
import dayjs from "dayjs";
import CheckBox from "_atoms/CheckBox";

const AccountInfoScreen = observer((props) => {
    const authStore = React.useContext(AuthStoreContext);
    const { control, handleSubmit, formState: { errors }, setFocus } = useForm({
        defaultValues: {
            first_name: authStore.user.first_name,
            last_name: authStore.user.last_name,
            email_address: authStore.user.email_address,
            phone_number: authStore.user.phone_number.toString(),
            birthdate: dayjs.unix(authStore.user.birthdate).format('DD-MM-YYYY'),
            newsletter: authStore.user.newsletter
        }
    });

    console.log('deci',authStore.user)
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

    const renderFlag = () => {
        return <View style={styles.flag}>
            <Image resizeMode={'contain'} style={styles.flagIcon} source={{uri: 'https://s3.amazonaws.com/spoonity-flags/ae.png'}}/>
            <TextInput editable={false} value={`(+971)`} allowFontScaling={false} style={styles.prefix}/>
        </View>
    }


    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={styles.accountInfoScreen}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: scaleSize(20) }}>
            <Container style={ styles.container }>
                <SectionTitle textStyle={styles.title}>Personal Information</SectionTitle>
                <View style={styles.divider}/>
                <View style={styles.namesWrapper}>
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            styleInput={{width:'47%'}}
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('last_name')}
                            ref={ref}
                            error={errors.firstName?.message}
                            label='FIRST NAME'/>
                        )}
                        name="first_name"
                        rules={{ required: 'First name is required'}}
                    />
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            styleInput={{width:'47%'}}
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('email_address')}
                            ref={ref}
                            error={errors.lastName?.message}
                            label='LAST NAME'/>
                        )}
                        name="last_name"
                        rules={{ required: 'Last name is required'}}
                    />
                </View>
                <View style={styles.divider}/>
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
                        label='EMAIL'/>
                    )}
                    name="email_address"
                    rules={{ required: 'Email is required', pattern: emailValidator}}
                />
                <View style={styles.divider}/>
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
                        rightAccessory={() => <Pressable style={{justifyContent:'center', paddingRight: Spacing.SPACING_4}} onPress={() => props.navigation.navigate('AccountSettings.ChangePassword')}>
                            <Text style={styles.inputLinkText}>CHANGE</Text>
                        </Pressable>}
                        ref={ref}
                        disabled={true}
                        editable={false}
                        error={errors.password?.message}
                        onSubmitEditing={() => setFocus('phone_number')}
                        label='PASSWORD'/>
                    )}
                    name="password"
                    rules={{required: true}}
                    defaultValue="12345678"
                />
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            leftAccessory={renderFlag}
                            placeholder={'Phone number'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            ref={ref}
                            error={errors.phone_number?.message}
                            label='PHONE NUMBER' />
                    )}
                    name="phoneNumber"
                    rules={{ required: 'Phone no. is required', pattern: phoneValidator}}
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
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                    <TextField
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        ref={ref}
                        disabled={true}
                        editable={false}
                        error={errors.birthdate?.message}
                        label='BIRTHDAY'/>
                    )}
                    name="birthdate"
                />
                <SectionTitle textStyle={styles.title}>Contact Preferences</SectionTitle>
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                        <CheckBox
                            style={{borderColor: Colors.BLACK}}
                            labelStyle={styles.checkBoxLabel}
                            onPress={() => onChange(!value)}
                            checked={value}
                            label={'I consent to receiving emails from Costa Coffee.'}
                            type={'square'}
                        />
                    )}
                    name="newsletter"
                    defaultValue={false}
                />
            </Container>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'Save'}/>
        </View>
    </KeyboardAvoidingView>

});

const styles = StyleSheet.create({
    accountInfoScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    container: {
        flex: 1,
        paddingBottom: Spacing.SPACING_5,
    },
    divider: {
        width:'100%',
        backgroundColor: Colors.LIGHT_GREY,
        height: 1,
        marginBottom: Spacing.SPACING_4,
    },
    namesWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
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
        fontSize: Typography.FONT_SIZE_22,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.BLACK,
        fontWeight:'700'
    },
    inputLinkText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        color: '#647581',
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
    },
    checkBoxLabel: {
        flex: 1,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
    },
})

export default AccountInfoScreen
