import React, { useState } from 'react'
import {
    StyleSheet,
    ImageBackground, View, ScrollView, SafeAreaView, Text,
} from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import backgroundImage from "_assets/images/auth/forgot_password.png";
import { scaleSize } from "_styles/mixins";
import Button from "_atoms/Button";
import { FONT_PRIMARY_BOLD, FONT_PRIMARY_REGULAR } from "_styles/typography";

const AccountValidationScreen = (props) => {

    const [loading, setLoading] = useState(false);

    function onLogin(data) {
       // todo
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} >
                <SafeAreaView style={ styles.loginScreen }>
                    <View style={styles.card}>
                        <Text style={styles.title}>Account Verification</Text>
                        <Text style={styles.description}>{`An email has been sent to ${props.params?.email} with a link to verify your Costa Coffee account.`}</Text>
                        <Button textStyle={styles.buttonTitle} bodyStyle={styles.button} loading={loading} onPress={onLogin} block={true} type={'primary'} text={'Log in'}/>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'flex-start',
        paddingHorizontal: Spacing.SPACING_5,
        flexGrow:1,
    },
    card: {
        backgroundColor:'white',
        width: '100%',
        marginTop: Spacing.SPACING_5,
        borderRadius: scaleSize(5),
        paddingHorizontal: Spacing.SPACING_5,
        paddingTop: Spacing.SPACING_5,
        paddingBottom: Spacing.SPACING_10,
    },
    button: {
        width:'100%',
        height: scaleSize(60),
        borderRadius: scaleSize(30),
    },
    buttonTitle: {
        fontSize: Typography.FONT_SIZE_18
    },
    title:{
        alignSelf: 'center',
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: FONT_PRIMARY_BOLD,
        fontWeight: 'bold',
        marginBottom: Spacing.SPACING_4
    },
    description: {
        color:'#617582',
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: FONT_PRIMARY_REGULAR,
        fontWeight: '500',
        textAlign:'center',
        marginBottom: Spacing.SPACING_10
    }
})

export default AccountValidationScreen
