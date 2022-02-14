import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    ImageBackground,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    Image,
    Pressable,
    Keyboard,
} from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import backgroundImage from "_assets/images/auth/forgot_password.png";
import { scaleSize } from "_styles/mixins";
import GiftCard from "_atoms/GiftCard";
import { request } from "_utils/request";
import creditCard from "_assets/images/account/credit-card.png";
import CloseIcon from '_assets/images/close.svg';
import costCard from "_assets/images/account/costa-card.png";
import { Controller, useForm } from "react-hook-form";
import TextField from "_atoms/TextField";
import { requiredValidation } from "_utils/validators";
import Button from "_atoms/Button";
import { visilabsApi } from "_utils/analytics";

const GiftCardScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([])
    const [addCard, setAddCard] = useState(false);
    const [error, setError] = useState('');
    const [showLostMessage, setShowLostMessage] = useState({});

    const { control, handleSubmit, formState , setFocus, reset } = useForm({mode: 'onChange'})

    useEffect(() => {
        visilabsApi.customEvent('Gift-Cards');
    },[])


    useEffect(()=>{
        request('/user/card/list.json', {
            method: 'GET',
            data:{},
            withToken: true,
            success: function (response) {
                setCards([...response.data])
            },
            error: (e) => {
                console.log('e',e);
            }
        });
    },[])


    //Todo Ask for testing cards
    const onLost = (card) => {
        request('/user/card/lost.json', {
            method: 'PUT',
            data:{
                "user_card": card.id
            },
            withToken: true,
            withoutJson: true,
            success: function (response) {
                const lostCard = cards.findIndex((item) => item.id === card.id);
                cards[lostCard] = {...cards[lostCard], status: {...cards[lostCard].status, name: 'Inactive'}}
                setCards([...cards]);
                setShowLostMessage({...showLostMessage, [card.id]: true})
            },
            error: (e) => {
                console.log('e',e);
            }
        });
    }

    const onDelete = (card) => {
        request('/user/card.json', {
            method: 'DELETE',
            data:{
                "user_card": card.id.toString()
            },
            withToken: true,
            withoutJson: true,
            success: function (response) {
                console.log('response', response);
                setCards([...cards.filter((item) => item.id !== card.id)])
                setShowLostMessage({...showLostMessage, [card.id]: false})
            },
            error: (e) => {
                console.log('e',e);
            }
        });
    }

    const onActivate = (card) => {
        request('/user/card/found.json', {
            method: 'PUT',
            data:{
                "user_card": card.id.toString()
            },
            withToken: true,
            withoutJson: true,
            success: function (response) {
                console.log('response', response);
                const activatedCard = cards.findIndex((item) => item.id === card.id);
                cards[activatedCard] = {...cards[activatedCard], status: {...cards[activatedCard].status, name: 'Active'}}
                setCards([...cards]);
                setShowLostMessage({...showLostMessage, [card.id]: false})
            },
            error: (e) => {
                console.log('e',e);
            }
        });
    }

    const renderCostaCards = () => {
        return cards.map((item) => {
            return (
                <GiftCard
                    key={item.id}
                    card={item}
                    onLost={onLost}
                    onDelete={onDelete}
                    onActivate={onActivate}
                    isLost={showLostMessage[item.id]}
                />
            )
        })
    }

    const onSubmit = data => {
        console.log('data',data);
        setLoading(true)
        request('/user/card/add.json', {
            method: 'POST',
            data:{
                number: data.number,
                pin: data.pin
            },
            withToken: true,
            success: function (response) {
                console.log('response', response);
                setCards([...cards, response])
                setLoading(false)
                setAddCard(false);
                reset();
            },
            error: (e) => {
                console.log('e',e);
                setLoading(false)
                setError(e.error?.errors[0]?.message)
            }
        });
    }

    const renderError = () => {
        if(!error) return;
        return <Text style={styles.errorMessage}>{error}</Text>
    }


    const renderContent = () => {
        if(!addCard){
        return (
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>COSTA COFFEE CARDS</Text>
                    </View>
                    {renderCostaCards()}
                    <Pressable onPress={() => setAddCard(true)} style={styles.newCard}>
                        <Image style={styles.cardIcon} source={creditCard}/>
                        <Text style={styles.newCardText}>ADD A NEW COSTA COFFEE CARD</Text>
                    </Pressable>
                </View>
            )
        }
        return (
            <View style={styles.card}>
                <View style={[styles.header, styles.addHeader]}>
                    <Text style={styles.headerText}>ADD A COSTA COFFEE CARD</Text>
                    <Pressable style={{padding: Spacing.SPACING_2}} onPress={() => {
                        reset();
                        setAddCard(false)
                    }}>
                        <CloseIcon width={scaleSize(12)} height={scaleSize(12)} fill={Colors.BLACK}/>
                    </Pressable>
                </View>
                <Text style={styles.numberAndPin}>NUMBER & PIN</Text>
                <View style={styles.description}>
                    <Image source={costCard}/>
                    <Text style={[styles.text, {flex:1}]}>Enter the 16 digit card number & 3-4 digit PIN on the back of your card</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                                blurOnSubmit={false}
                                styleInput={{width:'70%'}}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                maxLength={16}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder={'Card number'}
                                keyboardType={"phone-pad"}
                                onSubmitEditing={() => setFocus('pin')}
                                ref={ref}
                                error={formState.errors.number?.message}
                            />
                        )}
                        name="number"
                        rules={{ required: 'Card number is required', pattern: requiredValidation}}
                        defaultValue={''}
                    />
                    <Controller
                        control={control}
                        render={({ field: { ref, onChange, onBlur, value } }) => (
                            <TextField
                                blurOnSubmit={false}
                                styleInput={{width:'20%', paddingHorizontal:0}}
                                inputStyle={{paddingHorizontal:0, marginHorizontal:0, alignSelf:'center'}}
                                maxLength={4}
                                placeholder={'Pin'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                onBlur={onBlur}
                                keyboardType={"phone-pad"}
                                onChangeText={value => onChange(value)}
                                value={value}
                                onSubmitEditing={Keyboard.dismiss}
                                ref={ref}
                                error={formState.errors.pin?.message}
                                />
                        )}
                        name="pin"
                        rules={{ required: 'Required', pattern: requiredValidation}}
                        defaultValue={''}
                    />
                </View>
                {renderError()}
                <View style={styles.footer}>
                    <Button disabled={!formState.isValid} onPress={handleSubmit(onSubmit)} block={true} type={'primary'} text={'FINISH'} loading={loading} square={true}/>
                    <Text style={[styles.text, styles.footerText]}>Adding this card will add points and AED balance to your account. This action cannot be reversed.</Text>
                </View>
            </View>
        )
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} >
                <SafeAreaView style={ styles.loginScreen }>
                    {renderContent()}
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
        backgroundColor:Colors.WHITE,
        marginVertical: Spacing.SPACING_5,
        borderRadius: scaleSize(5),
        paddingBottom: Spacing.SPACING_10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width:'70%',
        alignSelf:'center',
    },
    header: {
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        justifyContent: 'center',
        alignItems:'center',
        borderTopLeftRadius: scaleSize(5),
        borderTopRightRadius: scaleSize(5),
        marginBottom: Spacing.SPACING_5,
    },
    addHeader:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft: Spacing.SPACING_5,
        marginBottom: Spacing.SPACING_3
    },
    headerText: {
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        color: Colors.WHITE,
        padding: Spacing.SPACING_2,
    },
    newCard:{
        width:'90%',
        minHeight: scaleSize(72),
        borderWidth:1,
        borderColor: '#333',
        paddingHorizontal: Spacing.SPACING_5,
        justifyContent: 'flex-start',
        flexDirection:'row',
        alignItems:'center',
    },
    newCardText: {
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        fontSize: Typography.FONT_SIZE_10,
        color: Colors.BLUE_GRAY,
        marginLeft: Spacing.SPACING_3,
    },
    cardIcon: {
        width: scaleSize(40),
        height: scaleSize(40),
    },
    numberAndPin: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_SECONDARY_BOLD
    },
    text: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_SECONDARY_BOLD
    },
    description:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: Spacing.SPACING_5
    },
    inputWrapper: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between',
        width:'100%',
        paddingHorizontal: Spacing.SPACING_5
    },
    footer:{
        paddingHorizontal: Spacing.SPACING_2,
    },
    footerText:{
        textAlign:'center',
        paddingTop: Spacing.SPACING_5,
    },
    errorMessage: {
        alignSelf: 'center',
        color: 'red',
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontSize: Typography.FONT_SIZE_16,
        textAlign: 'center',
        marginBottom: Spacing.SPACING_5,
        paddingHorizontal: Spacing.SPACING_2,

    },
})

export default GiftCardScreen
