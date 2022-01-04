import React, { useState } from 'react'
import {
    StyleSheet,
    ImageBackground, View, ScrollView, SafeAreaView, Text,
} from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { request } from '_utils/request'
import { useForm, Controller } from 'react-hook-form'
import backgroundImage from "_assets/images/auth/forgot_password.png";
import TextField from "_atoms/TextField";
import { scaleSize } from "_styles/mixins";
import Button from "_atoms/Button";
import { FONT_PRIMARY_REGULAR } from "_styles/typography";
import { passwordValidators } from "_utils/constants";
import { AuthStoreContext } from "_stores";

const OldPasswordScreen = (props) => {
    const { control, handleSubmit, formState } = useForm({mode:'onBlur'});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const authStore = React.useContext(AuthStoreContext);

    const renderError = () => {
        if(!error) return;
        return <Text style={styles.errorMessage}>{error}</Text>
    }

    function onSubmit(data) {
        setLoading(true)
        request('/user/profile.json', {
            method: 'PUT',
            data: {
                "password": props.route.params.password,
                "current_password": data.password,
            },
            withToken: true,
            withoutJson: true,
            success: function ( ) {
                authStore.logout()
                setLoading(false)
            },
            error: (e) => {
                setLoading(false)
                setError(e.error?.errors[0]?.message)
            }
        });
    }
    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} >
                <SafeAreaView style={ styles.loginScreen }>
                    <View style={styles.card}>
                        <Text style={styles.description}>{`Before we change your password, we need to verify you are the account owner`}</Text>
                        <Controller
                            control={control}
                            render={({ field: { ref, onChange, onBlur, value } }) => (
                                <TextField
                                    placeholder={'Current password'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    onBlur={onBlur}
                                    secureTextEntry={true}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    ref={ref}
                                    label='PASSWORD'/>
                            )}
                            name="password"
                            rules={{ required: 'Password is required', pattern: passwordValidators}}
                            defaultValue={''}
                        />
                        {renderError()}
                        <Button
                            disabled={false}
                            textStyle={styles.buttonTitle}
                            bodyStyle={styles.button}
                            loading={loading}
                            onPress={handleSubmit(onSubmit)}
                            block={true}
                            square={true}
                            type={'primary'}
                            text={'Save Settings'}
                        />
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
        width:'70%',
        alignSelf:'center',
    },
    description: {
        color: Colors.BLUE_GRAY,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: FONT_PRIMARY_REGULAR,
        marginBottom: Spacing.SPACING_5
    },
    errorMessage: {
        color: Colors.ERROR,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        marginBottom: Spacing.SPACING_5
    },
    buttonTitle: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontWeight: 'normal'
    }
})

export default OldPasswordScreen
