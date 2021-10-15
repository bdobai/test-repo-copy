import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_small_white.svg'
import EmailIcon from '_assets/images/account/email.svg'
import PhoneIcon from '_assets/images/account/phone.svg'
import {Linking} from 'react-native'

const SupportScreen = (props) => {
    //TODO take phone and email from API
    const phone = '(+971) 522 633 000';
    const email = 'support_cc@cc.com';

    const dialNumber = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${phone}`; }
        else {phoneNumber = `telprompt:${phone}`; }
        Linking.openURL(phoneNumber);
    }
    const sendEmail = () => {
        Linking.openURL('mailto:'+{email})
    }

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.supportScreen}>
        {/*<Header left={<BackButton/>} center={<Logo style={ styles.logo }/>}/>*/}
        <Text style={styles.title}>SUPPORT</Text>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <View style={styles.phone}>
                        <PhoneIcon onPress={()=>{dialNumber()}}/>
                        <Text style={styles.text}>{phone}</Text>
                    </View>
                    <View style={styles.email}>
                        <EmailIcon onPress={() => sendEmail()}/>
                        <Text style={styles.text}>{email}</Text>
                    </View>
                </Container>
            </SafeAreaView>
        </ScrollView>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    email: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.SPACING_6,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    phone: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    supportScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    text: {
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_18,
        marginLeft: Spacing.SPACING_4,
    },
    title: {
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})

export default SupportScreen
