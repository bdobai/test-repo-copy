import React, { useState, useEffect } from 'react'
import {
    FlatList,
    Image, Pressable,
    StatusBar,
    StyleSheet, Text, View,
} from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { request } from '_utils/request'
import { scaleSize } from "_styles/mixins";
import Spinner from "_atoms/Spinner";
import { dateFormat, isIphone } from "_utils/helpers";
import { WebView } from 'react-native-webview';
import CloseIcon from '_assets/images/alerts/close.svg';
import RightChevron from "_assets/images/right-chevron.svg";

const MessagesScreen = (props) => {
    const [selected, setSelected] = useState('inbox');
    const [data, setData] = React.useState([])
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        getMessages();
    }, []);

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

    const removeMessage = (message) => {
        request('/user/message', {
            method: 'PUT',
            withToken: true,
            data:{
                read: true, // false for add
                status_id: 4, // 1 for add, 4 for remove
                user_message: message.user_message_id, // 47 or 6970 for demo@spoonity.com
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

    const onPress = (item) => {
        props.navigation.navigate('Messages.Details', {item})
    }

    const renderItem = ({item}) => {
        return <Pressable onPress={() => onPress(item)} style={styles.card}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>{item.message.title}</Text>
                <Text style={styles.date}>{dateFormat(item.message.publish_date, 'MMM-DD')}</Text>
            </View>
            {item.message.banner && <Image source={{ uri: item.message.banner }} style={{width: '100%', height: scaleSize(120)}}/> }
            <View style={{paddingHorizontal: Spacing.SPACING_4, height: scaleSize(120)}}>
                <WebView startInLoadingState={true} source={{ html: item.message.body }} originWhitelist={['*']} scrollEnabled={false} scalesPageToFit={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}/>
            </View>
            <Pressable onPress={() => removeMessage(item)} style={styles.closeIcon}>
                <CloseIcon width={scaleSize(10)} height={scaleSize(10)}/>
            </Pressable>
            <View style={styles.arrowWrapper}>
                <RightChevron width={scaleSize(24)} height={scaleSize(24)} fill={'orange'}/>
            </View>
        </Pressable>
    }

    const getData = () => {
        let array = [...data];
        if(selected === 'inbox') {
            array = array.filter((item) => item.read === false)
        }else {
            array = array.filter((item) => item.read === true)
        }
        return array.sort((a,b)=> a.message.publish_date < b.message.publish_date)
    }

    return (
        <View style={{flex:1, backgroundColor: Colors.WHITE}}>
            <View style={styles.header}>
                <Pressable onPress={() => setSelected('inbox')} style={[styles.card, styles.inbox]}>
                    <Text style={[styles.headerText, selected === 'inbox' ? {fontFamily: Typography.FONT_PRIMARY_MEDIUM} : {}]}>Inbox</Text>
                </Pressable>
                <Pressable onPress={() => setSelected('archived')} style={[styles.card, styles.archive]}>
                    <Text style={[styles.headerText, selected === 'archived' ? {fontFamily: Typography.FONT_PRIMARY_MEDIUM} : {}]}>Archived</Text>
                </Pressable>
            </View>
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
    header: {
        flexDirection: 'row',
        width:'100%',
        marginTop: Spacing.SPACING_4,
    },
    inbox:{
        flex:1,
        marginRight: scaleSize(2),
        marginLeft: Spacing.SPACING_4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 0,
        height: scaleSize(45),
        marginBottom: Spacing.SPACING_1,
    },
    archive: {
        flex:1,
        marginLeft: scaleSize(2),
        marginRight: Spacing.SPACING_4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 0,
        height: scaleSize(45),
        marginBottom: Spacing.SPACING_1,
    },
    headerText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLUE_GRAY
    },
    arrowWrapper: {
        alignItems: 'flex-end',
        paddingHorizontal: Spacing.SPACING_2,
        justifyContent: 'flex-end',
        paddingTop: Spacing.SPACING_2,
    }
})

export default MessagesScreen
