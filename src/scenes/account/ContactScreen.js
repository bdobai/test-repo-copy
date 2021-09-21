import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native'
import Header from '_components/molecules/Header'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import BackButton from '_atoms/BackButton'
import { Controller, useForm } from 'react-hook-form'
import { request } from '_utils/request'
import { HEADER_SPACE } from '_styles/spacing'
import Logo from '_assets/images/logo_2.svg'

const ContactScreen = (props) => {
    const { control, handleSubmit, errors } = useForm();
    const titleRef = React.useRef()
    const messageRef = React.useRef()
    const [loading, setLoading] = useState(false);

    const onSubmit = data => {
        props.navigation.navigate('AccountSettings.Confirmation')
        // setLoading(true)
        // request('/account/change-password', {
        //     method: 'POST',
        //     data: data,
        //     success: function (response) {
        //         setLoading(false)
        //         props.navigation.navigate('AccountSettings')
        //     },
        //     error: () => {
        //         setLoading(false)
        //     }
        // });
    };

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={ styles.changePasswordScreen}>
        <Header left={<BackButton/>} center={<Logo style={ styles.logo }/>}/>
        <Text style={styles.title}>CONTACT</Text>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <SafeAreaView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                    <Container style={ styles.container }>
                        <Controller
                            control={control}
                            onFocus={() => {titleRef.current.focus()}}
                            render={({ onChange, onBlur, value }) => (                          
                            <TextField
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                onSubmitEditing={() => messageRef.current.focus()}
                                ref={titleRef}
                                error={errors.title?.message}
                                containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Title'/>
                            )}
                            name="title"
                            rules={{ required: 'Title is required'}}
                            defaultValue={''}
                        />
                        <Controller
                            control={control}
                            onFocus={() => {messageRef.current.focus()}}
                            render={({ onChange, onBlur, value }) => (
                                <View style={styles.textAreaContainer} >
                                <TextInput
                                    style={styles.textArea}
                                    multiline={true}
                                    numberOfLines={10}
                                    placeholder='Message'
                                    placeholderTextColor="white"
                                    fontSize={Typography.FONT_SIZE_18}
                                    lineHeight={Typography.LINE_HEIGHT_24}
                                    onChangeText={value => onChange(value)}
                                    onBlur={onBlur}
                                    onSubmitEditing={() => handleSubmit(onSubmit)}
                                    ref={titleRef}
                                    error={errors.title?.message}
                                />
                                </View>
                            )}
                            name="message"
                            rules={{ required: 'Message is required'}}
                            defaultValue={''}
                        />
                    </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Send'}/>
        </View>
        
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    textAreaContainer: {
        borderBottomColor: Colors.PRIMARY_LIGHT,
        borderBottomWidth: 1,
    },
    textArea: {
        textAlignVertical: 'top',
        color: Colors.WHITE,
    },
    changePasswordScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    container: {
        flex: 1,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
        paddingHorizontal: Spacing.SPACING_5
    },
    title: {
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})

export default ContactScreen
