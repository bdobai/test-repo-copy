import React, { useState, useEffect } from 'react'
import {
    ImageBackground,
    ScrollView,
    StyleSheet, View,
} from "react-native";
import { Colors, Spacing } from '_styles'
import { request } from '_utils/request'
import HTMLView from '_components/atoms/HTMLView';
import backgroundImage from "_assets/images/auth/forgot_password.png";
import { scaleSize } from "_styles/mixins";
import Spinner from "_atoms/Spinner";

const TermsScreen = (props) => {
    const [content, setContent] = React.useState([])
    const [loading, setLoading] = useState(false);

    const getTerms = () => {
        setLoading(true);
        request('/vendor/content/terms-of-service.json', {
            method: 'GET',
            data: {
                "vendor": 107430
            },
            withToken: false,
            success: function (response) {
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
        getTerms();
    }, []);

    return <ImageBackground source={backgroundImage} style={styles.privacyScreen}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container} contentContainerStyle={[styles.contentContainer, loading ? {height:'100%'} : {}]}>
                {!loading ? <HTMLView loading={loading} html={content}></HTMLView> : <View style={styles.loading}><Spinner/></View>}
            </ScrollView>
    </ImageBackground>
}

const styles = StyleSheet.create({
    privacyScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingHorizontal: Spacing.SPACING_5,
        paddingVertical: Spacing.SPACING_5
    },
    container: {
        backgroundColor: Colors.WHITE,
        borderRadius: scaleSize(5),
    },
    contentContainer: {
        paddingHorizontal: Spacing.SPACING_5,
    },
    loading: {
        height:'100%',
        justifyContent:'center'
    }
})

export default TermsScreen
