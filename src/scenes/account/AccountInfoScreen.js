import React, { useEffect, useState } from "react";
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
import { emailValidator, phoneValidator, requiredValidation } from "_utils/validators";
import { request } from '_utils/request'
import { observer } from 'mobx-react-lite'
import SectionTitle from '_atoms/SectionTitle';
import TextField from "_atoms/TextField";
import { scaleSize } from "_styles/mixins";
import dayjs from "dayjs";
import CheckBox from "_atoms/CheckBox";
import RightChevron from '_assets/images/right-chevron.svg';
import ErrorIcon from "_assets/images/alerts/error.svg";

const costCard = require('_assets/images/account/costa-card.png');
const creditCard = require('_assets/images/account/credit-card.png');


const AccountInfoScreen = observer((props) => {
    const authStore = React.useContext(AuthStoreContext);
    const { control, handleSubmit, formState: { errors }, setFocus } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            first_name: authStore.user.first_name,
            last_name: authStore.user.last_name,
            email_address: authStore.user.email_address,
            phone_number: authStore.user.phone_number?.slice(3),
            birthdate: dayjs.unix(authStore.user.birthdate).format('DD-MM-YYYY'),
            newsletter: authStore.user.contact_consent === 3
        }
    });

    const [loading, setLoading] = useState(false);

    // ToDo Ask if extra validation is required for email and phone number
    const onSubmit = data => {
        setLoading(true)
        Keyboard.dismiss();
        request('/user/profile.json', {
            method: 'PUT',
            data: {
                "first_name": data.first_name,
                "last_name": data.last_name,
                // "email_address": data.email_address,
                // "phone_number": `971${data.phone_number}`,
                "contact_consent": data.newsletter ? 3 : 2,
            },
            withToken: true,
            withoutJson: true,
            success: function () {
                authStore.getUser()
                setLoading(false)
            },
            error: (e) => {
                console.log('e',e);
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
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: scaleSize(120) }}>
            <Container style={ styles.container }>
                <SectionTitle textStyle={styles.title}>Personal Information</SectionTitle>
                <View style={styles.divider}/>
                <View style={styles.namesWrapper}>
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            round={true}
                            styleInput={{width:'47%'}}
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('last_name')}
                            ref={ref}
                            error={errors.first_name?.message}
                            label='First Name'/>
                        )}
                        name="first_name"
                        rules={{ required: 'First name is required', pattern: requiredValidation}}
                    />
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                        <TextField
                            round={true}
                            styleInput={{width:'47%'}}
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => setFocus('email_address')}
                            ref={ref}
                            error={errors.last_name?.message}
                            label='Last Name'/>
                        )}
                        name="last_name"
                        rules={{ required: 'Last name is required', pattern:requiredValidation}}
                    />
                </View>
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                    <TextField
                        round={true}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        keyboardType={'email-address'}
                        onSubmitEditing={() => setFocus('password')}
                        ref={ref}
                        error={errors.email_address?.message}
                        label='Email'/>
                    )}
                    name="email_address"
                    rules={{ required: 'Email is required', pattern: emailValidator}}
                />
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                    <TextField
                        round={true}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        secure={true}
                        rightAccessory={() => <Pressable style={{justifyContent:'center', paddingRight: Spacing.SPACING_4}} onPress={() => props.navigation.navigate('AccountSettings.NewPassword')}>
                            <Text style={styles.inputLinkText}>CHANGE</Text>
                        </Pressable>}
                        ref={ref}
                        disabled={true}
                        editable={false}
                        error={errors.password?.message}
                        onSubmitEditing={() => setFocus('phone_number')}
                        label='Password'/>
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
                            round={true}
                            leftAccessory={renderFlag}
                            placeholder={'Phone number'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            ref={ref}
                            keyboardType={"phone-pad"}
                            error={errors.phone_number?.message}
                            label='Mobile Number' />
                    )}
                    name="phone_number"
                    rules={{ required: 'Phone no. is required', pattern: phoneValidator}}
                />
                <View style={styles.divider}/>
                <Controller
                    control={control}
                    render={({ field: { ref, onChange, onBlur, value } }) => (
                    <TextField
                        round={true}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        ref={ref}
                        disabled={true}
                        editable={false}
                        inputStyle={{color:Colors.GRAY_DARK2}}
                        error={errors.birthdate?.message}
                        label='Birthday'/>
                    )}
                    name="birthdate"
                />
                <View style={styles.absoluteDivider}/>
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
                <View style={[styles.absoluteDivider, {marginTop: Spacing.SPACING_5}]}/>
                <SectionTitle textStyle={styles.title}>Cards</SectionTitle>
                <View style={styles.divider}/>
                <Pressable onPress={() => props.navigation.navigate('AccountSettings.GiftCards')} style={styles.cardRow}>
                    <View style={styles.namesWrapper}>
                        <Image style={styles.cardIcon} source={costCard}/>
                        <Text style={styles.cardText}>Costa Cofee Cards</Text>
                    </View>
                    <RightChevron width={scaleSize(16)} height={scaleSize(16)} fill={'black'}/>
                </Pressable>
                <View style={styles.divider}/>
                <Pressable onPress={() => props.navigation.navigate('AccountSettings.GiftCards')} style={styles.cardRow}>
                    <View style={styles.namesWrapper}>
                        <Image style={styles.cardIcon} source={creditCard}/>
                        <Text style={styles.cardText}>Credit Cards</Text>
                    </View>
                    <RightChevron width={scaleSize(16)} height={scaleSize(16)} fill={'black'}/>
                </Pressable>
                <View style={styles.absoluteDivider}/>
                <View style={styles.deleteContainer}>
                    <ErrorIcon width={scaleSize(20)} height={scaleSize(20)} fill={Colors.ERROR} style={{marginRight: Spacing.SPACING_2}}/>
                    <Text style={styles.delete}>Delete Account</Text>
                </View>
                <View style={styles.absoluteDivider}/>
            </Container>
        </ScrollView>
        <View style={styles.floatingButton}>
            <Button bodyStyle={{width: scaleSize(120)}} textStyle={{fontSize: scaleSize(24)}} loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'Save'}/>
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
    absoluteDivider: {
        width:'200%',
        backgroundColor: Colors.LIGHT_GREY,
        height: 1,
        marginBottom: Spacing.SPACING_4,
        marginLeft: -Spacing.SPACING_5
    },
    namesWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    floatingButton: {
        position:'absolute',
        bottom: scaleSize(30),
        right: scaleSize(10),
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
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.SPACING_3,
        alignItems: 'center',
        marginBottom: Spacing.SPACING_4,
    },
    cardIcon: {
        width: scaleSize(40),
        height: scaleSize(40),
    },
    cardText: {
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        marginLeft: Spacing.SPACING_2
    },
    delete: {
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        color: Colors.ERROR,
        marginLeft: Spacing.SPACING_1
    },
    deleteContainer:{
        marginBottom: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_1,
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default AccountInfoScreen
