import React, { useEffect, useState } from 'react'
import { Image, Linking, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { observer } from 'mobx-react-lite'
import { Colors, Spacing, Typography } from "_styles";
import BeansCard from "_atoms/BeansCard";
import Button from "_atoms/Button";
import { request } from "_utils/request";
import BarcodeCard from "_atoms/BarcodeCard";
import { scaleSize } from "_styles/mixins";
import menuImage from '_assets/images/home/menu-image.jpg'
import giftHand from '_assets/images/home/gift-hand.png'
import { isIphone } from "_utils/helpers";
import Swiper from 'react-native-swiper'
import { visilabsApi } from "_utils/analytics";

const HomeScreen = observer((props) => {
    const [refreshing, setRefreshing] = useState(false)
    const [loadingBarcode, setLoadingBarcode] = useState(false);
    const [loadingRewards, setLoadingRewards] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [barcode, setBarcode] = useState(null);
    const [rewards, setRewards] = useState(null);
    const [messages, setMessages] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            visilabsApi.customEvent('Home');
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
        getMessages();
    },[])

    const onRefresh = () => {
        setRefreshing(true)
        getRewards();
        getToken();
        getMessages();
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

    const getMessages = () => {
        setLoadingMessages(true);
        request('/user/message/list.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: function (response) {
                setMessages(response);
                setLoadingMessages(false);
            },
            error: (error) => {
                console.log('error', error.error)
                setLoadingMessages(false);
            }
        });
    }

    const onMenu = () => {
        let data = {
            "OM.seeMenu": 'See menu'
        };
        visilabsApi.customEvent("Press see menu from Home screen", data);
        Linking.openURL('https://docs.google.com/gview?embedded=true&url=https://www.costacoffee.ae/docs/costadeliverymenu.pdf');
    }

    const getBalance = () => {
        if(!rewards?.balances?.length) return 0;
        const index = rewards?.balances?.findIndex((item) => item.id === 3);
        return rewards?.balances[index]?.balance;
    }

    const onOrderOnline = () => {
        return props.navigation.navigate('App', {screen:'Stores'})
    }

    const onGiftCardBalance = () => {
        return props.navigation.navigate('Modal',  {screen: 'Balance'})
    }

    const renderReward = () => {
        if(!rewards?.data[0]?.available) return;
        return (
            <View style={styles.card}>
                <Image source={giftHand} style={styles.hand}/>
                <View style={styles.rewardWrapper}>
                    <Text style={styles.timeFor}>Time for</Text>
                    <Text style={styles.reward}>{rewards?.data[0]?.available} x {rewards?.data[0]?.name}!</Text>
                </View>
            </View>
        )
    }

    const onPressMessage = (item) => {
        props.navigation.navigate('Modal', {screen: 'Messages.Details', params:{item}})
    }

    const renderMessages = () => {
        if(loadingMessages || !messages?.length) return;
        return (
            <Swiper
                key={messages.length}
                style={styles.swiper}
                autoplay={true}
                autoplayTimeout={2.5}
                loop={true}
                dotStyle={{bottom:-10}}
                activeDotStyle={{bottom:-10, backgroundColor: Colors.PRIMARY}}
                horizontal={true}
                // onIndexChanged={(value) =>setIndex(value)}
                // index={index}
            >
                {messages.map((item) => (<Pressable key={item.message.title} style={styles.messageCard} onPress={() => onPressMessage(item)}>
                    <Text style={styles.messageTitle}>{item.message.title}</Text>
                    <Text style={styles.messageDescription}>{item.message.subtitle}</Text>
                    {/*{item.message.banner && <Image source={{ uri: item.message.banner }} style={{width: '100%', height: scaleSize(120)}}/> }*/}
                    <Image source={{ uri: 'https://pbs.twimg.com/media/E4TqORmUUAEr7Fk?format=jpg&name=4096x4096' }} style={{width: '100%', height: scaleSize(100)}}/>
                </Pressable>))}
            </Swiper>
        )
    }

    return <ScrollView
      style={{backgroundColor: Colors.WHITE}}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      bounces={true}
      refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }>
        <BeansCard balance={getBalance()} tier={rewards?.tier?.current?.name}/>
        {renderReward()}
        {barcode && <BarcodeCard barcode={barcode} loading={loadingBarcode}/>}
        <Button type={'primary'} square={true} size={'sm'} text={'Gift Card Balance'} bodyStyle={styles.smallButton} onPress={onGiftCardBalance}/>
        <View style={styles.divider}/>
        <Button type={'outlinePrimary'} square={true} size={'sm'} text={'Order Online'} bodyStyle={styles.smallButton} onPress={onOrderOnline}/>
        <View style={styles.divider}/>
        {renderMessages()}
        <View style={styles.campaign}>
            <Image source={menuImage} style={styles.menuImage}/>
            <View style={styles.menuBackground}>
                <Button
                    type={'outlinePrimary'}
                    size={'sm'}
                    text={'See the menu'}
                    bodyStyle={[styles.smallButton, { height: scaleSize(40), width: scaleSize(155) }]}
                    textStyle={{fontSize: Typography.FONT_SIZE_20, fontFamily: Typography.FONT_SECONDARY_REGULAR, fontWeight: '500'}}
                    onPress={onMenu}
                />
            </View>
        </View>
    </ScrollView>
})

const styles = StyleSheet.create({
    contentContainer:{
        paddingTop: Spacing.SPACING_4,
        paddingBottom: Spacing.SPACING_10
    },
    divider: {
        width:'100%',
        backgroundColor: Colors.LIGHT_GREY,
        marginVertical: Spacing.SPACING_1
    },
    smallButton: {
        width: scaleSize(225),
        alignSelf: 'center',
        height: scaleSize(35)
    },
    campaign: {
        height: scaleSize(170),
        paddingHorizontal: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_1,
        flexDirection: 'row',
        borderRadius: scaleSize(5),
        overflow: "hidden"
    },
    menuImage:{
        width:'50%',
        height: '100%',
        borderTopLeftRadius: scaleSize(5),
        borderBottomLeftRadius: scaleSize(5),
    },
    menuBackground: {
        backgroundColor: Colors.PRIMARY,
        width:'50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: scaleSize(5),
        borderBottomRightRadius: scaleSize(5)
    },
    timeFor: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_14,
        color: Colors.PRIMARY
    },
    reward: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_20,
        fontWeight: "bold",
        color: Colors.PRIMARY
    },
    hand: {
        height: scaleSize(70),
        width: scaleSize(110),
        resizeMode: 'contain'
    },
    card: {
        backgroundColor: '#F4F4F4',
        borderRadius: scaleSize(5),
        flexDirection: 'row',
        paddingRight: Spacing.SPACING_4,
        paddingLeft: Spacing.SPACING_1,
        marginHorizontal: Spacing.SPACING_5,
        marginBottom: Spacing.SPACING_4,
    },
    messageTitle: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.PRIMARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
    },
    messageDescription: {
        fontSize: Typography.FONT_SIZE_14,
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        paddingBottom: Spacing.SPACING_2,
    },
    messageCard: {
        height: scaleSize(180),
        marginHorizontal: Spacing.SPACING_5,
        padding: Spacing.SPACING_4,
        backgroundColor: '#F4F4F4',
        borderRadius: scaleSize(5)
    },
    rewardWrapper: {
        flex:1,
        justifyContent:'center',
        paddingLeft: Spacing.SPACING_3
    },
    swiper:{
        height: scaleSize(200),
        marginBottom: Spacing.SPACING_4,
        marginTop: Spacing.SPACING_4
    }
})

export default HomeScreen
