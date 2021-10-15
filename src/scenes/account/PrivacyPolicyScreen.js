import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_small_white.svg'
import HTMLView from '_components/atoms/HTMLView';

const PrivacyPolicyScreen = (props) => {
    const [title, setTitle] = React.useState([])
    const [content, setContent] = React.useState([])
    const [loading, setLoading] = useState(false);

    const getPolicy = () => {
        setLoading(true);
        request('/vendor/content/privacy-policy.json', {
            method: 'GET',
            data: {
                "vendor": 107430
            },
            withToken: false,
            success: function (response) {
                setTitle(response.title);
                setContent(response.content);
                setLoading(false);
            },
            error: (error) => {
                console.log(error);
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        getPolicy();
    }, []);

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.privacyScreen}>
        {/*<Header left={<BackButton/>} center={<Logo style={ styles.logo }/>}/>*/}
        <Text style={styles.title}>{title}</Text>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <HTMLView loading={loading} html={content}></HTMLView>
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
    title: {
        textTransform: 'uppercase',
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})

export default PrivacyPolicyScreen
