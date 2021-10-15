import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import Button from '_atoms/Button'
import BackButton from '_atoms/BackButton'
import { request } from '_utils/request'
import Logo from '_assets/images/logo_small_white.svg'
import EmailIcon from '_assets/images/account/email-icon.svg'
import { scaleSize } from '_styles/mixins'

const ContactConfirmationScreen = (props) => {
    const [loading, setLoading] = useState(false);

    return <View style={{ flex: 1 }}>
        <SafeAreaView keyboardShouldPersistTaps='handled' style={ styles.confirmationScreen }>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={{ flex: 1 }}>
            {/*<Header left={<BackButton/>} center={<Logo style={ styles.logo }/>}/>*/}
                <Container style={ styles.container }>
                    <View style={styles.info}>
                        <EmailIcon style={styles.icon}></EmailIcon>
                        <Text style={styles.infoText}>Your message has been sent to Us! Thank you!</Text>
                    </View>
                    <View style={styles.footer}>
                        <Button loading={loading} onPress={() => props.navigation.navigate('Home')} block={true} type={'secondary'} text={'Back to home'}/>
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
        bottom: Spacing.SPACING_3
    },
    info: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleSize(62)
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
    confirmationScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
})

export default ContactConfirmationScreen
