import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_2.svg'

const privacyPolicy = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
+ 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit'
+ 'in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt'
+ ' mollit anim id est laborum.'
+ 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit'
+ 'in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt'
+ ' mollit anim id est laborum.'

const PrivacyPolicyScreen = (props) => {
    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.privacyScreen}>
        <Header left={<BackButton/>} center={<Logo style={ styles.logo }/>}/>
        <Text style={styles.title}>PRIVACY POLICY</Text>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <Text style={styles.text}>{privacyPolicy}</Text>
                </Container>
            </SafeAreaView>
        </ScrollView>        
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    privacyScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    container: {
        flex: 1,
    },
    text: {
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_20,
    },
    title: {
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})

export default PrivacyPolicyScreen
