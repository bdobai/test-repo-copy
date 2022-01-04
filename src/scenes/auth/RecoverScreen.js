import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    ImageBackground, View, ScrollView, SafeAreaView, StatusBar,
} from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { request } from '_utils/request'
import { useForm, Controller } from 'react-hook-form'
import backgroundImage from "_assets/images/auth/forgot_password.png";
import TextField from "_atoms/TextField";
import { emailValidator } from "_utils/validators";
import { scaleSize } from "_styles/mixins";
import Button from "_atoms/Button";

const RecoverScreen = (props) => {
    const { control, handleSubmit, formState } = useForm({mode:'onBlur'});

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            StatusBar.setBarStyle('light-content')
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
        });

        return unsubscribe;
    }, [props.navigation]);

    const [loading, setLoading] = useState(false);

    function onSubmit(data) {
        setLoading(true)
        request('/user/password-reset/reset.json?', {
            method: 'POST',
            data: {
                email_address: data.email,
                vendor: 107430
              },
            withToken: false,
            withoutJson: true,
            success: function (response) {
                props.navigation.navigate('Login')
                setLoading(false)
            },
            error: (e) => {
                setLoading(false)
            }
        });
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} >
                <SafeAreaView style={ styles.loginScreen }>
                    <View style={styles.card}>
                        <Controller
                            control={control}
                            render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                    placeholder={'Email'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    keyboardType={'email-address'}
                                    ref={ref}
                                    label='EMAIL'/>
                            )}
                            name="email"
                            rules={{ required: 'Email is required', pattern: emailValidator}}
                            defaultValue={''}
                        />
                        <Button disabled={!formState.isValid} textStyle={styles.buttonTitle} bodyStyle={styles.button} loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'RESET PASSWORD'}/>
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
})

export default RecoverScreen
