import React, { useState, useEffect } from 'react'
import {
    Alert,
    FlatList,
    Image, Pressable,
    StatusBar,
    StyleSheet, Text, View,
} from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { request } from '_utils/request'
import { scaleSize, WINDOW_WIDTH } from "_styles/mixins";
import Spinner from "_atoms/Spinner";
import { dateFormat, isIphone } from "_utils/helpers";
import { WebView } from 'react-native-webview';
import RightChevron from "_assets/images/right-chevron.svg";
import { visilabsApi } from "_utils/analytics";

const MessagesScreen = (props) => {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        visilabsApi.customEvent('Messages');
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            getMessages()
            StatusBar.setBarStyle('light-content')
            if(!isIphone()){
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor('transparent');
            }
        });
        return unsubscribe;
    }, [props.navigation]);


    const getMessages = () => {
        setLoading(true);
        request('/user/message/list.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: function (response) {
                setData(response);
                setLoading(false);
            },
            error: (error) => {
                setLoading(false);
            }
        });
    }

    const readMessage = (message) => {
        if(message.read === true) return;
        request('/user/message', {
            method: 'PUT',
            withToken: true,
            data:{
                read: true,
                status_id: 1,
                user_message: message.user_message_id,
            },
            success: function () {
                const newData = data.filter((item) => item.user_message_id !== message.user_message_id)
                setData([...newData]);
                setLoading(false);
            },
            error: (error) => {
                console.log('error', error.error.errors)
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        if(!data?.length) return;
        data.map((item) => readMessage(item));
    },[data.length])

    const renderListEmptyComponent = () => {
        if(loading) return <Spinner color={Colors.PRIMARY}/>
        return <View style={styles.card}><Text style={[styles.headerText, { paddingTop: Spacing.SPACING_4, paddingLeft: Spacing.SPACING_2 }]}>No messages</Text></View>
    }

    const onPress = (item) => {
        props.navigation.navigate('Messages.Details', {item})
    }

    const renderItem = ({item}) => {
        return <Pressable onPress={() => onPress(item)} style={styles.card}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>{item.message.title}</Text>
                <Text style={styles.date}>{dateFormat(item.message.publish_date, 'MMM-DD')}</Text>
            </View>
            {item.message.banner && <View style={styles.imageWrapper}><Image source={{ uri: item.message.banner }} style={{width: '100%', height: '100%'}}/></View> }
            <View style={{paddingHorizontal: Spacing.SPACING_4, height: scaleSize(120)}}>
                <WebView startInLoadingState={true} source={{ html: item.message.body }} originWhitelist={['*']} scrollEnabled={false} scalesPageToFit={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}/>
            </View>
            <View style={styles.arrowWrapper}>
                <RightChevron width={scaleSize(24)} height={scaleSize(24)} fill={'orange'}/>
            </View>
        </Pressable>
    }

    const getData = () => {
        return data.sort((a,b)=> a.message.publish_date < b.message.publish_date)
    }

    return (
        <View style={{flex:1, backgroundColor: Colors.WHITE}}>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={styles.privacyScreen}
                contentContainerStyle={styles.contentContainer}
                data={getData()}
                renderItem={renderItem}
                ListEmptyComponent={renderListEmptyComponent}
        />
    </View>
    )
}

const styles = StyleSheet.create({
    privacyScreen: {
        backgroundColor: Colors.WHITE,
    },
    container: {
        backgroundColor: Colors.WHITE,
        borderRadius: scaleSize(5),
    },
    contentContainer: {
        paddingVertical: Spacing.SPACING_5
    },
    card: {
        backgroundColor: Colors.WHITE,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: Spacing.SPACING_4,
        marginBottom: Spacing.SPACING_8,
        paddingBottom: Spacing.SPACING_5,
        borderRadius: scaleSize(5)
    },
    imageWrapper: {
        height: (WINDOW_WIDTH-Spacing.SPACING_4*2)/2.6,
    },
    title: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
    },
    titleWrapper: {
        paddingHorizontal: Spacing.SPACING_2,
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingTop: Spacing.SPACING_3,
        paddingBottom: Spacing.SPACING_2
    },
    date: {
        color: Colors.BLUE_GRAY
    },
    closeIcon: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -scaleSize(11),
        right: -scaleSize(5),
        width: scaleSize(20),
        height: scaleSize(24),
        borderRadius: scaleSize(20),
    },
    arrowWrapper: {
        alignItems: 'flex-end',
        paddingHorizontal: Spacing.SPACING_2,
        justifyContent: 'flex-end',
        paddingTop: Spacing.SPACING_2,
    }
})

export default MessagesScreen
