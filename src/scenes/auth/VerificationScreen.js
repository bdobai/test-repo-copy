import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import Button from '_atoms/Button'
import { request } from '_utils/request'
import { scaleSize } from '_styles/mixins'
import InfoIcon from '_assets/images/account/info.svg'

const VerificationScreen = (props) => {
    const email = 'test@mail.com'

    const [loading, setLoading] = useState(false);

    function resendLink() {
        console.log('resend link')
    }

    return <View style={{ flex: 1 }}>
        <SafeAreaView keyboardShouldPersistTaps='handled' style={ styles.verificationScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
                <Header bg={false} center={<Text style={ styles.verificationTitle }>ACCOUNT VERIFICATION</Text>} style={{marginTop: scaleSize(10)}}/>
                <Container style={ styles.container }>
                    <View style={styles.info}>
                        <InfoIcon style={styles.icon}></InfoIcon>
                        <Text style={styles.infoText}>An email has been sent to <Text style={{fontWeight: 'bold'}}>{email}</Text> with a link to verify your Costa Coffee account</Text>
                    </View>
                    <View style={styles.footer}>
                        <View>
                            <Pressable onPress={() => resendLink()}><Text style={styles.footerText}>Resend link</Text></Pressable>
                        </View>
                        <Button loading={loading} onPress={() => props.navigation.navigate('Register')} block={true} type={'secondary'} text={'Sign up'}/>
                    </View>
                </Container>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    icon: {
        flex: 1,
        bottom: Spacing.SPACING_4
    },
    info: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        textAlign: 'center',
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_30,
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
    },
    footerText: {
        color: Colors.SECONDARY,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingBottom: Spacing.SPACING_4
    },
    verificationScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    verificationTitle: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.SECONDARY
    },
})

export default VerificationScreen
