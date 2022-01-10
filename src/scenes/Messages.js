import React, { useState, useEffect } from 'react'
import {
    ActivityIndicator,
    FlatList, Image,
    ImageBackground,
    ScrollView, StatusBar,
    StyleSheet, Text, View,
} from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { request } from '_utils/request'
import HTMLView from '_components/atoms/HTMLView';
import backgroundImage from "_assets/images/auth/forgot_password.png";
import { scaleSize } from "_styles/mixins";
import Spinner from "_atoms/Spinner";
import { dateFormat, isIphone } from "_utils/helpers";

const Messages = (props) => {
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

    const getTerms = () => {
        setLoading(true);
        request('/user/message/list.json', {
            method: 'GET',
            withToken: true,
            data:{},
            success: function (response) {
                console.log('response', response);
                setData(response);
                setLoading(false);
            },
            error: (error) => {
                console.log('error', error.error)
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        getTerms();
    }, []);

    const renderListEmptyComponent = () => {
        if(loading) return <Spinner color={Colors.PRIMARY}/>
        return <View/>
    }

    const renderItem = ({item}) => {
        return <View style={styles.card}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>{item.message.title}</Text>
                <Text style={styles.date}>{dateFormat(item.message.publish_date, 'MMM-DD')}</Text>
            </View>
            {item.message.banner && <Image source={{ uri: item.message.banner }} style={{width: '100%', height: 120}}/> }
            <View style={{overflow:'hidden', paddingHorizontal: Spacing.SPACING_4, height:120}}>
                <HTMLView html={item.message.body} contentWidth={300}/>
            </View>
        </View>
    }

    return <FlatList
        style={styles.privacyScreen}
        contentContainerStyle={styles.contentContainer}
        data={data.reverse()}
        renderItem={renderItem}
        ListEmptyComponent={renderListEmptyComponent}
    />
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
        height:200,
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
    }
})

export default Messages
