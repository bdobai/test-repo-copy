import React, { useEffect, useState } from 'react'
import {
    Image,
    Linking,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { observer } from 'mobx-react-lite'
import { Colors, Spacing, Typography } from "_styles";
import BeansCard from "_atoms/BeansCard";
import Button from "_atoms/Button";
import { request } from "_utils/request";
import BarcodeCard from "_atoms/BarcodeCard";
import { scaleSize, WINDOW_WIDTH } from "_styles/mixins";
import menuImage from '_assets/images/home/menu-image.jpg'
import freeDrink from '_assets/images/home/free_drink.png'
import { isIphone } from "_utils/helpers";
import Swiper from 'react-native-swiper'
import { euroMessageApi, visilabsApi } from "_utils/analytics";
import banner from '_assets/images/home/banner.jpg';
import banner2 from '_assets/images/home/banner_2.jpg';
import useNotifications from "_utils/notifications-hook";
import { AuthStoreContext } from "_stores";

const HomeScreen = observer((props) => {
    const [refreshing, setRefreshing] = useState(false)
    const [loadingBarcode, setLoadingBarcode] = useState(false);
    const [loadingRewards, setLoadingRewards] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [barcode, setBarcode] = useState(null);
    const [rewards, setRewards] = useState(null);
    const [messages, setMessages] = useState(null);
    const [index, setIndex] = useState(0);
    const [balance, setBalance] = useState(null);
    const authStore = React.useContext(AuthStoreContext);

    const onSuccess = (data, id) => {
        if(!data.length  || !id) return;
        const index = data.findIndex((item) => (item.message?.message_id == id || item.user_message_id == id))
        if(index===-1) return;
        props.navigation.navigate('Modal', {screen: 'Messages.Details', params:{'item': data[index]}})

    }

    const handleRouting = (value) => {
        switch (value) {
            case 'giftCards':
                return props.navigation.navigate('AccountNavigator', {screen:'AccountSettings.GiftCards'})
            case 'balance':
                return props.navigation.navigate('Modal', {screen:'Gift Cards'})
            case 'stores':
                return props.navigation.navigate('Stores')
            case 'storesClickAndCollect':
                return props.navigation.navigate('Stores', {clickAndCollect:true})
            case 'history':
                return props.navigation.navigate('History')
            case 'account':
                return props.navigation.navigate('Account')
            case 'personalInfo':
                return props.navigation.navigate('AccountNavigator',  {screen:'AccountSettings.Info'})
            case 'faq':
                return props.navigation.navigate('AccountNavigator',  {screen:'AccountSettings.FAQ'})
            case 'menu':
                return Linking.openURL('https://docs.google.com/gview?embedded=true&url=https://www.costacoffee.ae/docs/costadeliverymenu.pdf');
        }
    }

    const onNotification = (id) => {
        if(!id) return;
        const type = id?.toString().split('type:').pop()
        if(type){
            handleRouting(type);
            return
        }
        getMessages((data) => onSuccess(data, id))
    }

    useNotifications(authStore?.user?.email_address, authStore?.user?.id, onNotification);

    useEffect(() => {
        request('/user/quick-pay/balance.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: (response) => {
                setBalance(response);
            },
            error: () => {
            },
        });
    },[])

    const addExtra = async () => {
        return await euroMessageApi.setUserProperties({
            "pushPermit": "Y",
            "gsmPermit": "Y",
            "emailPermit": "Y",
            "Email": authStore?.user?.email_address,
            "Keyid": authStore?.user?.id,
        })
    }

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

    const getMessages = (onSuccess) => {
        setLoadingMessages(true);
        request('/user/message/list.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: function (response) {
                setMessages(response);
                setLoadingMessages(false);
                onSuccess && onSuccess(response)
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
        return props.navigation.navigate('App', {screen:'Stores', params:{clickAndCollect:true}})
    }

    const onGiftCardBalance = () => {
        return props.navigation.navigate('Modal',  {screen: 'Balance'})
    }

    const renderReward = () => {
        if(!rewards?.data[0]?.available) return;
        return (
            <View style={styles.card}>
                <Image source={freeDrink} style={styles.hand}/>
                <View style={styles.rewardWrapper}>
                    <Text style={styles.reward}>{`You have ${rewards?.data[0]?.available} x ${rewards?.data[0]?.name}!`}</Text>
                </View>
            </View>
        )
    }

    const onPressMessage = (item) => {
        props.navigation.navigate('Modal', {screen: 'Messages.Details', params:{item}})
    }

    const renderMessage = (item) => {
        if(!item.message?.banner) {
            return (
                <Pressable key={item.message.title} style={[styles.messageCard, { padding: 0, paddingVertical:0 }]} onPress={() => onPressMessage(item)}>
                    <Image source={banner} style={{ width:'100%', height: '100%' }} />
                </Pressable>
            )
        }

        return (
            <Pressable key={item.message.title} style={[styles.messageCard, { padding: 0, paddingVertical:0 }]} onPress={() => onPressMessage(item)}>
                {item.message.banner && <Image source={{ uri: item.message.banner }} style={{ width:'100%', height: '100%' }} /> }
            </Pressable>
        )
    }

    const renderMessages = () => {
        if(loadingMessages) return;
        if(!messages?.length){
            return (
                <Swiper
                    style={styles.swiper}
                    autoplay={true}
                    autoplayTimeout={2.5}
                    loop={true}
                    dotStyle={{bottom:-5}}
                    activeDotStyle={{bottom:-5, backgroundColor: Colors.PRIMARY}}
                    horizontal={true}
                >
                    <View style={[styles.messageCard, { padding: 0, paddingVertical:0 }]}>
                        <Image source={banner} style={{ width:'100%', height: '100%' }} />
                    </View>
                    <View style={[styles.messageCard, { padding: 0, paddingVertical:0 }]}>
                        <Image source={banner2} style={{ width:'100%', height: '100%' }} />
                    </View>
                </Swiper>
            )
        }
        return (
            <Swiper
                key={messages.length}
                style={styles.swiper}
                autoplay={true}
                autoplayTimeout={2.5}
                loop={true}
                dotStyle={{bottom:-5}}
                activeDotStyle={{bottom:-5, backgroundColor: Colors.PRIMARY}}
                horizontal={true}
                // onIndexChanged={(value) =>setIndex(value)}
                // index={index}
            >
                {messages.map((item) => renderMessage(item))}
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
        <Button type={'primary'} square={true} size={'sm'} text={balance ? `Gift Card-AED${balance?.amount?.toFixed(0)}` : 'Gift Card'} bodyStyle={styles.smallButton} onPress={onGiftCardBalance}/>
        <View style={styles.divider}/>
        <Button type={'outlinePrimary'} square={true} size={'sm'} text={'Click & Collect'} bodyStyle={styles.smallButton} onPress={onOrderOnline}/>
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
        fontSize: Typography.FONT_SIZE_16,
        fontWeight: "bold",
        color: Colors.PRIMARY
    },
    hand: {
        height: scaleSize(40),
        width: scaleSize(40),
        resizeMode: 'contain'
    },
    card: {
        height: scaleSize(56),
        borderRadius: scaleSize(28),
        backgroundColor: 'rgb(228,215,228)',
        flexDirection: 'row',
        alignItems:'center',
        paddingRight: Spacing.SPACING_4,
        paddingLeft: Spacing.SPACING_4,
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
        height: (WINDOW_WIDTH-Spacing.SPACING_4*2)/2.6,
        marginHorizontal: Spacing.SPACING_5,
        padding: Spacing.SPACING_4,
        paddingVertical: Spacing.SPACING_2,
        backgroundColor: '#F4F4F4',
        borderRadius: scaleSize(5)
    },
    rewardWrapper: {
        flex:1,
        justifyContent:'center',
        paddingLeft: Spacing.SPACING_3
    },
    swiper:{
        height: (WINDOW_WIDTH-Spacing.SPACING_4*2)/2.6 + scaleSize(25),
        marginBottom: Spacing.SPACING_4,
        marginTop: Spacing.SPACING_4
    }
})

export default HomeScreen
