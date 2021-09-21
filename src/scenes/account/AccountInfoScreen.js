import React, { Component, useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View, Image, Pressable, Text, Keyboard } from 'react-native'
import Header from '_components/molecules/Header'
import PageTitle from '_components/atoms/PageTitle'
import Card from '_components/atoms/Card'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { TextField } from '_components/atoms/MaterialField'
import Button from '_components/atoms/Button'
import { Controller, useForm } from 'react-hook-form'
import { AuthStoreContext } from '_stores'
import { cityValidator, emailValidator, phoneValidator, zipCodeValidator } from '_utils/validators'
import { request } from '_utils/request'
import { observer } from 'mobx-react-lite'
import BackButton from '_atoms/BackButton'
import Logo from '_assets/images/logo_2.svg'

const AccountInfoScreen = observer((props) => {
    const authStore = React.useContext(AuthStoreContext);
    const { control, handleSubmit, errors } = useForm({
        defaultValues: authStore.user
    });

    const firstNameRef = React.useRef()
    const lastNameRef = React.useRef()
    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const countryRef = React.useRef()
    const phoneRef = React.useRef()
    const dayRef = React.useRef()
    const monthRef = React.useRef()
    const yearRef = React.useRef()

    const [loading, setLoading] = useState(false);
    const [newPhoto, setNewPhoto] = useState(null);
    const [states, setStates] = useState([]);

    const getCounties = () => {
        request('/get-states', {
            method: 'POST',
            success: function (response) {
                setStates(response.map((item) => {
                    return {
                        key: item.id,
                        value: item.id,
                        label: item.name,
                    }
                }))
            }
        });
    }

    useEffect(() => {
        getCounties();
    }, []);

    const onSubmit = data => {
        Keyboard.dismiss();
        setLoading(true)

        let formData = new FormData()
        // if (newPhoto) {
        //     formData.append("new_photo", {
        //         name: newPhoto.fileName,
        //         type: newPhoto.type,
        //         uri: Platform.OS === "android" ? newPhoto.uri : newPhoto.uri.replace("file://", "")
        //     });
        // }
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        request('/account/save-info', {
            method: 'POST',
            files: true,
            data: formData,
            success: function (response) {
                setLoading(false)
                authStore.getUser()
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    // const openPicker = () => {
    //     launchImageLibrary({
    //         noData: true,

    //     }, (response) => {
    //         if (response.uri) {
    //             setNewPhoto(response)
    //             actionSheetRef.current?.setModalVisible(false)
    //         }
    //     })
    // }

    // const openCamera = () => {
    //     launchCamera({
    //         mediaType: 'photo',
    //     }, (response) => {
    //         if (response.uri) {
    //             setNewPhoto(response)
    //             actionSheetRef.current?.setModalVisible(false)
    //         }
    //     })
    // }

    const actionSheetRef = React.useRef();

    // const openActionSheet = () => {
    //     // Keyboard.dismiss();
    //     actionSheetRef.current?.setModalVisible()
    // }


    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={styles.accountInfoScreen}>
        <Header
          left={<BackButton/>}
          center={<Logo style={ styles.logo }/>}
        />
        <Text style={styles.title}>PERSONAL INFORMATION</Text>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    {/* <Pressable style={styles.avatarWrapper} onPress={() => openActionSheet()}>
                        {newPhoto || authStore.user.image ? <Image style={styles.image} source={{uri: newPhoto ? newPhoto.uri : getImage(authStore.user.image, 100, 100, false)}}/> : <UserIcon height={42} width={42} fill={'#ffffff'}/>}
                        <View style={styles.imageBtn}>
                            <CameraIcon fill={Colors.GRAY_DARK} height={scaleSize(16)} width={scaleSize(16)}/>
                        </View>
                    </Pressable> */}
                    <Controller
                        control={control}
                        onFocus={() => {firstNameRef.current.focus()}}
                        render={({ onChange, onBlur, value }) => (
                        <TextField
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => lastNameRef.current.focus()}
                            ref={firstNameRef}
                            error={errors.firstName?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3, marginTop: 30 }} label='First name'/>
                        )}
                        name="firstName"
                        rules={{ required: 'First name is required'}}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {lastNameRef.current.focus()}}
                        render={({ onChange, onBlur, value }) => (
                        <TextField
                            autoCorrect={false}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => emailRef.current.focus()}
                            ref={lastNameRef}
                            error={errors.lastName?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Last name'/>
                        )}
                        name="lastName"
                        rules={{ required: 'Last name is required'}}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {emailRef.current.focus()}}
                        render={({ onChange, onBlur, value }) => (
                        <TextField
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            keyboardType={'email-address'}
                            onSubmitEditing={() => passwordRef.current.focus()}
                            ref={emailRef}
                            error={errors.email?.message}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='E-mail address'/>
                        )}
                        name="email"
                        rules={{ required: 'Email is required', pattern: emailValidator}}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {passwordRef.current.focus()}}
                        render={({ onChange, onBlur, value }) => (
                        <TextField
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            secure={true}
                            ref={passwordRef}
                            error={errors.password?.message}
                            onSubmitEditing={() => countryRef.current.focus()}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Password*'/>
                        )}
                        name="password"
                        rules={{required: true}}
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        onFocus={() => {countryRef.current.focus()}}
                        render={({ onChange, onBlur, value }) => (
                        <TextField
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            onSubmitEditing={() => phoneRef.current.focus()}
                            ref={countryRef}
                            error={errors.phone?.message}
                            mask={"(+###)"}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Country*'/>
                        )}
                        name="country"
                        rules={{ required: 'Country is required'}}
                        defaultValue={''}
                    />
                    <Controller
                        control={control}
                        onFocus={() => {phoneRef.current.focus()}}
                        render={({ onChange, onBlur, value }) => (
                        <TextField
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            keyboardType={'phone-pad'}
                            onSubmitEditing={() => dayRef.current.focus()}
                            ref={phoneRef}
                            error={errors.phone?.message}
                            mask={"+1 (###) ###-####"}
                            containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Phone no.'/>
                        )}
                        name="phone"
                        rules={{ required: 'Phone no. is required', pattern: phoneValidator}}
                    />
                    <View style={styles.row}>
                        <View style={styles.col1}>
                            <Controller
                                control={control}
                                onFocus={() => {dayRef.current.focus()}}
                                render={({ onChange, onBlur, value }) => (
                                <TextField
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    onSubmitEditing={() => monthRef.current.focus()}
                                    ref={dayRef}
                                    error={errors.city?.message}
                                    containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Day'/>
                                )}
                                name="day"
                                rules={{ pattern: cityValidator}}
                            />
                        </View>
                        <View style={styles.col2}>
                            <Controller
                                control={control}
                                onFocus={() => {monthRef.current.focus()}}
                                render={({ onChange, onBlur, value }) => {
                                    return <TextField
                                    type={'select'}
                                    items={states}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value}
                                    ref={monthRef}
                                    containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Month'/>
                                }}
                                name="month"
                            />
                        </View>
                        <View style={styles.col3}>
                            <Controller
                                control={control}
                                onFocus={() => {yearRef.current.focus()}}
                                render={({ onChange, onBlur, value }) => (
                                <TextField
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    onSubmitEditing={() => handleSubmit(onSubmit)}
                                    ref={yearRef}
                                    error={errors.zip_code?.message}
                                    containerStyle={{ marginBottom: Spacing.SPACING_3 }} label='Year'/>
                                )}
                                name="year"
                                rules={{ pattern: zipCodeValidator}}
                            />
                        </View>
                    </View>
                </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)} block={true} type={'secondary'} text={'Save'}/>
            {/* This needs to be moved inside password input */}
            <Pressable onPress={() => props.navigation.navigate('AccountSettings.ChangePassword')}>
                <Text style={{color: Colors.SECONDARY}}>Change password</Text>
            </Pressable>
        </View>
        {/* <ActionSheet containerStyle={{overflow: 'hidden'}} ref={actionSheetRef}>
            <SafeAreaView>
                <Pressable android_ripple={{color: Colors.SECONDARY + 40}} onPress={() => openPicker()} style={({pressed}) => pressed ? styles.actionSheetButtonPressed : styles.actionSheetButton}>
                    <Text style={styles.actionSheetButtonText}>Select from library</Text>
                </Pressable>
                <Pressable android_ripple={{color: Colors.SECONDARY + 40}} onPress={() => openCamera()} style={({pressed}) => pressed ? styles.actionSheetButtonPressed : styles.actionSheetButton}>
                    <Text style={styles.actionSheetButtonText}>Open camera</Text>
                </Pressable>
            </SafeAreaView>
        </ActionSheet> */}
    </KeyboardAvoidingView>

});

const styles = StyleSheet.create({
    accountInfoScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    container: {
        flex: 1,
    },
    col1: {
        position: 'relative',
        flex: 1,
        marginRight: Spacing.SPACING_2,
        overflow: 'hidden',
    },
    col2: {
        position: 'relative',
        flex: 1,
        marginLeft: Spacing.SPACING_3,
        overflow: 'hidden',
    },
    col3: {
        position: 'relative',
        flex: 1,
        marginLeft: Spacing.SPACING_3,
        overflow: 'hidden',
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: Spacing.SPACING_4,
        paddingHorizontal: Spacing.SPACING_5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    // avatarWrapper: {
    //     width: scaleSize(100),
    //     height: scaleSize(100),
    //     position: 'absolute',
    //     left: '50%',
    //     top: scaleSize(-50),
    //     marginLeft: scaleSize(-25),
    //     borderRadius: scaleSize(50),
    //     backgroundColor: '#DDF6FE',
    //     borderWidth: 3,
    //     borderColor: Colors.WHITE,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // imageBtn: {
    //     width: scaleSize(40),
    //     height: scaleSize(40),
    //     position: 'absolute',
    //     left: scaleSize(30),
    //     bottom: scaleSize(-20),
    //     borderRadius: scaleSize(20),
    //     backgroundColor: Colors.GRAY_MEDIUM,
    //     borderWidth: 3,
    //     borderColor: Colors.WHITE,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // image: {
    //     width: '100%',
    //     height: '100%',
    //     borderRadius: scaleSize(50),
    // },
    // actionSheetButton: {
    //     paddingVertical: Spacing.SPACING_3,
    //     paddingHorizontal: Spacing.SPACING_5,
    //     borderBottomWidth: 1,
    //     borderBottomColor: Colors.GRAY_LIGHT,
    //     overflow: 'hidden'
    // },
    // actionSheetButtonPressed: {
    //     paddingVertical: Spacing.SPACING_3,
    //     paddingHorizontal: Spacing.SPACING_5,
    //     borderBottomWidth: 1,
    //     borderBottomColor: Colors.SECONDARY,
    //     overflow: 'hidden',
    //     backgroundColor: Colors.MUTED + '50'
    // },
    // actionSheetButtonText: {
    //     fontFamily: Typography.FONT_PRIMARY_REGULAR,
    //     fontSize: Typography.FONT_SIZE_20,
    //     lineHeight: Typography.LINE_HEIGHT_20,
    //     color: Colors.SECONDARY,
    //     textAlign: 'center',
    // },
    title: {
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3,
    },
})

export default AccountInfoScreen
