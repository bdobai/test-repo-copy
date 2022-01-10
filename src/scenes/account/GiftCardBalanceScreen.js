import React, { useEffect, useState } from "react";
import {
    Image, StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import balanceBackground from '_assets/images/home/balance-background.png';
import { scaleSize } from "_styles/mixins";
import { request } from "_utils/request";
import Button from "_atoms/Button";
import Spinner from "_atoms/Spinner";
import { isIphone } from "_utils/helpers";

const GiftCardsScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(null);

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

    return (
        <View style={ styles.giftCardScreen}>
           <View style={[styles.contentWrapper, loading ? {justifyContent: 'center'} : {justifyContent: 'flex-start'}]}>
               {loading ? <Spinner size={'small'} color={Colors.PRIMARY}/> : <>
                   <Text style={ styles.title }>{`BALANCE: AED${balance?.amount.toFixed(2)}`}</Text>
                   <Text style={ styles.description }>Last updated: just now</Text>
                   <Button type={'primary'} square={true} size={'sm'} text={'Add or Manage Gift Cards'} bodyStyle={styles.smallButton} onPress={onManage}/>
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
        marginTop: scaleSize(100),
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
    }
})

export default GiftCardsScreen
