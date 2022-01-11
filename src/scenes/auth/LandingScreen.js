import React, { useEffect } from "react";
import { StyleSheet, ImageBackground, View, SafeAreaView, StatusBar } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import ButtonRounded from "_atoms/ButtonRounded";
import { scaleSize } from "_styles/mixins";
import { isIphone } from "_utils/helpers";

const backgroundImage = require('_assets/images/auth/landing.png');

const LandingScreen = (props) => {

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            StatusBar.setBarStyle('light-content')
            if(!isIphone()){
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor('transparent');
            }
        });

        return unsubscribe;
    }, [props.navigation]);

    return <ImageBackground style={styles.background} source={backgroundImage}>
        <SafeAreaView>
        <View style={styles.buttonsContainer}>
            <ButtonRounded onPress={() => props.navigation.navigate('Login')} bodyStyle={styles.body} type={'primary'} text={'Log In'} textStyle={styles.text}/>
            <ButtonRounded onPress={() => props.navigation.navigate('Register')} bodyStyle={styles.body} text={'Register'} textStyle={styles.text}/>
        </View>
        </SafeAreaView>
    </ImageBackground>
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'flex-end'
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingBottom: Spacing.SPACING_4,
    },
    text: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16,
        fontWeight: '700',
        marginVertical: Spacing.SPACING_1/2
    },
    body: {
        width: '40%',
        height: scaleSize(40),
        borderRadius: scaleSize(20),
    }
})

export default LandingScreen
