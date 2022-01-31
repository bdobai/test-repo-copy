import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_small_white.svg'
import { scaleSize } from '../../styles/mixins'
import HTMLView from '_components/atoms/HTMLView';

const FaqScreen = (props) => {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = useState(false);

    const getFaq = () => {
        setLoading(true);
        request('/vendor/content/help-topics.json', {
            method: 'GET',
            data: {
                "vendor": 107430,
                "limit" : 1000
            },
            withToken: false,
            success: function (response) {
                setData(response.data);
                setLoading(false);
            },
            error: (error) => {
                console.log(error);
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        getFaq();
    }, []);

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.faqScreen}>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
            {data.map(function(d, id) {
                return (
                <Container style={ styles.container }>
                    <Text style={styles.faqTitle}>{d.title}</Text>
                    <HTMLView loading={loading} html={d.content}></HTMLView>
                    <View style={styles.bottomLine}></View>
                </Container>
                )
            })}
            </SafeAreaView>
        </ScrollView>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    bottomLine: {
        borderWidth: scaleSize(1),
        borderColor: Colors.PRIMARY_LIGHT,
    },
    container: {
        flex: 1,
        marginBottom: Spacing.SPACING_3,
    },
    faqScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    faqTitle: {
        color: Colors.PRIMARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontWeight: 'bold',
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_16,
        marginTop: Spacing.SPACING_3,
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

export default FaqScreen
