import React, { useEffect, useState } from 'react'
import { Image, Linking, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { observer } from 'mobx-react-lite'
import { Colors, Spacing, Typography } from "_styles";
import BeansCard from "_atoms/BeansCard";
import Button from "_atoms/Button";
import { request } from "_utils/request";
import BarcodeCard from "_atoms/BarcodeCard";
import { scaleSize } from "_styles/mixins";
import campaignImage from '_assets/images/home/campaign-image.png'
import campaignImage2 from '_assets/images/home/campaign-image-2.png'
import menuImage from '_assets/images/home/menu-image.png'
import { isIphone } from "_utils/helpers";

const HomeScreen = observer((props) => {
    const [refreshing, setRefreshing] = useState(false)
    const [loadingBarcode, setLoadingBarcode] = useState(false);
    const [loadingRewards, setLoadingRewards] = useState(false);
    const [barcode, setBarcode] = useState(null);
    const [rewards, setRewards] = useState(null);

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
        getToken();
        getRewards();
    },[])

    const onRefresh = () => {
        setRefreshing(true)
        getRewards();
        getToken()
    }

    const getToken = () => {
        setLoadingBarcode(true);
        request('/user/token/request.json', {
            method: 'POST',
            withToken: true,
            data:{},
            success: (response) => {
                setBarcode(response);
                setLoadingBarcode(false);
            },
            error: () => {
                setLoadingBarcode(false);
            },
        });
    }

    const getRewards = () => {
        setLoadingRewards(true)
        request('/user/reward/list.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: (response) => {
                setRewards(response);
                setLoadingRewards(false);
                setRefreshing(false);
            },
            error: () => {
                setLoadingRewards(false);
            },
        });
    }

    const onMenu = () => {
        Linking.openURL('https://docs.google.com/gview?embedded=true&url=https://www.costacoffee.ae/docs/costadeliverymenu.pdf');
    }

    const renderButtons = () => {
        if(!rewards?.data?.length) return;
        return rewards.data.map((item) => {
            if(!item.available) return
            return <Button key={item.name} type={'secondary'} square={true} text={`Time for ${item.available} x ${item.name}`} bodyStyle={{backgroundColor: '#87744a', marginBottom: Spacing.SPACING_3}} textStyle={{fontSize: Typography.FONT_SIZE_22}}/>
        })
    }

    const getBalance = () => {
        if(!rewards?.balances?.length) return null;
        const index = rewards?.balances?.findIndex((item) => item.id === 3);
        return rewards?.balances[index]?.balance;
    }

    const onOrderOnline = () => {
        return props.navigation.navigate('App', {screen:'Stores'})
    }

    const onGiftCardBalance = () => {
        return props.navigation.navigate('Modal',  {screen: 'Balance'})
    }

    return <ScrollView
      style={{backgroundColor: Colors.WHITE}}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      bounces={true}
      refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }>
        <Text style={styles.sectionTitle}>YOUR BEANS</Text>
        <BeansCard balance={getBalance()}/>
        <View style={styles.buttonWrapper}>
            {renderButtons()}
        </View>
        <Text style={styles.sectionTitle}>SCAN ME AT THE TILL</Text>
        <BarcodeCard barcode={barcode} loading={loadingBarcode}/>
        <Button type={'primary'} square={true} size={'sm'} text={'Gift Card Balance'} bodyStyle={styles.smallButton} onPress={onGiftCardBalance}/>
        <View style={styles.divider}/>
        <Button type={'outlinePrimary'} square={true} size={'sm'} text={'Order Online'} bodyStyle={styles.smallButton} onPress={onOrderOnline}/>
        <Image source={campaignImage} style={styles.campaign}/>
        <Image source={campaignImage2} style={styles.campaign}/>
        <View style={styles.campaign}>
            <Image source={menuImage} style={styles.menuImage}/>
            <View style={styles.menuBackground}>
                <Button type={'outlinePrimary'} size={'sm'} text={'See the menu'} bodyStyle={[styles.smallButton, { height: scaleSize(40) }]} textStyle={{fontSize: Typography.FONT_SIZE_22, fontFamily: Typography.FONT_SECONDARY_REGULAR}} onPress={onMenu}/>
            </View>
        </View>
    </ScrollView>
})

const styles = StyleSheet.create({
    sectionTitle: {
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        paddingLeft: Spacing.SPACING_4,
        marginBottom: Spacing.SPACING_2,
    },
    contentContainer:{
        paddingTop: Spacing.SPACING_4,
        paddingBottom: Spacing.SPACING_10
    },
    buttonWrapper: {
        marginHorizontal: Spacing.SPACING_7,
        marginTop: Spacing.SPACING_4,
        marginBottom: Spacing.SPACING_3,
    },
    divider: {
        width:'100%',
        backgroundColor: Colors.LIGHT_GREY,
        height: scaleSize(1),
        marginVertical: Spacing.SPACING_4
    },
    smallButton: {
        width: scaleSize(175),
        alignSelf: 'center',
        height: scaleSize(35)
    },
    campaign: {
        height: scaleSize(170),
        width: '100%',
        marginTop: Spacing.SPACING_5,
        flexDirection: 'row'
    },
    menuImage:{
        width:'50%',
        height: '100%',
    },
    menuBackground: {
        backgroundColor: Colors.PRIMARY,
        width:'50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default HomeScreen
