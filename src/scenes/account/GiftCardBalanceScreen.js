import React, { useEffect, useState } from "react";
import {
    Alert,
    Image, StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import balanceBackground from '_assets/images/home/balance-background.jpg';
import { scaleSize, WINDOW_WIDTH } from "_styles/mixins";
import { request } from "_utils/request";
import Button from "_atoms/Button";
import Spinner from "_atoms/Spinner";
import { isIphone } from "_utils/helpers";
import { visilabsApi } from "_utils/analytics";
import giftCard from '_assets/images/gift_cards/gift_card.png';

const GiftCardsScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        visilabsApi.customEvent('Gift-Card-Balance');
    },[])

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

    useEffect(() => {
        setLoading(true);
        request('/user/quick-pay/balance.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: (response) => {
                setBalance(response);
                setLoading(false);
            },
            error: () => {
                setLoading(false);
            },
        });
    },[])

    const onManage = () => {
        props.navigation.navigate('AccountNavigator', {screen: 'AccountSettings.GiftCards'})
    }

    const onReloadGiftCard = () => Alert.alert('Coming soon');

    return (
        <View style={ styles.giftCardScreen}>
           <View style={[styles.contentWrapper, loading ? {justifyContent: 'center'} : {justifyContent: 'flex-start'}]}>
               <View style={styles.cardContainer}>
                   <View style={styles.cardShadow}>
                        <Image source={giftCard} style={styles.card} resizeMode={'stretch'}/>
                   </View>
               </View>
               {loading ? <Spinner size={'small'} color={Colors.PRIMARY}/> : <>
                   <Text style={ styles.title }>{`BALANCE: AED${balance?.amount.toFixed(2)}`}</Text>
                   <Text style={ styles.description }>Last updated: just now</Text>
                   <Button type={'primary'} square={true} size={'sm'} text={'Manage Gift Cards'} bodyStyle={styles.smallButton} onPress={onManage}/>
                   <Button type={'outlinePrimary'} square={true} size={'sm'} text={'Add Balance'} bodyStyle={[styles.smallButton, { marginTop: Spacing.SPACING_4 }]} onPress={onReloadGiftCard}/>
               </>
               }
            </View>
            <Image source={balanceBackground} style={styles.backgroundImage}/>
    </View>
    )
}

const styles = StyleSheet.create({
    giftCardScreen: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        justifyContent: "space-between",
    },
    backgroundImage: {
        width: '100%',
        height: scaleSize(175)
    },
    title: {
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_24,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        marginBottom: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_6,
    },
    description: {
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        color: Colors.PRIMARY,
        marginBottom: Spacing.SPACING_5
    },
    smallButton: {
        width: scaleSize(245),
        alignSelf: 'center',
        height: scaleSize(35)
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    cardContainer: {
      width:'100%',
      paddingHorizontal: Spacing.SPACING_6,
      paddingTop: Spacing.SPACING_6,
      backgroundColor: Colors.WHITE,
    },
    card: {
        width:'100%',
        height: (WINDOW_WIDTH-2*Spacing.SPACING_6)/1.53,
        backgroundColor: Colors.WHITE,
    },
    cardShadow:{
        backgroundColor:Colors.WHITE,
        borderRadius: scaleSize(36),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})

export default GiftCardsScreen
