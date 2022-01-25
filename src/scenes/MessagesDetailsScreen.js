import * as React from 'react';
import { View, StyleSheet, Text, Image, Alert } from "react-native";
import { dateFormat } from "_utils/helpers";
import { Colors, Spacing, Typography } from "_styles";
import { WebView } from "react-native-webview";
import { scaleSize } from "_styles/mixins";
import Button from "_atoms/Button";
import { request } from "_utils/request";
import { useState } from "react";

const MessagesDetailsScreen = (props) => {
    const {item} = props.route.params;
    const [loading, setLoading] = useState(false);

    const removeMessage = (message) => {
        setLoading(true);
        request('/user/message', {
            method: 'PUT',
            withToken: true,
            data:{
                read: false, // false for add
                status_id: 1, // 1 for add, 4 for remove
                user_message: 6970// message.user_message_id, // 47 or 6970 for demo@spoonity.com
            },
            success: function () {
                setLoading(false);
                props.navigation.navigate('Messages', {id:47})
            },
            error: (error) => {
                console.log('error', error.error.errors)
                setLoading(false);
            }
        });
    }

    const onDelete = () => {
        Alert.alert('', 'Are you sure you want to delete this message', [
            {
                text: 'Yes',
                onPress: () => {removeMessage(item)}
            },
            {
                text: 'Cancel',
                style: 'cancel'
            },
        ])
    }

    return (
        <View style={styles.container}>
            <View onPress={() => onPress(item)} style={styles.card}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{item.message.title}</Text>
                    <Text style={styles.date}>{dateFormat(item.message.publish_date, 'MMM-DD')}</Text>
                </View>
                {item.message.banner && <Image source={{ uri: item.message.banner }} style={{width: '100%', height: scaleSize(120)}}/> }
                <View style={{paddingHorizontal: Spacing.SPACING_4, flex:1}}>
                    <WebView
                        startInLoadingState={true}
                        source={{ html: item.message.body }}
                        originWhitelist={['*']}
                        scrollEnabled={true}
                        scalesPageToFit={false}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                <Button
                    loading={loading}
                    onPress={onDelete}
                    block={true}
                    type={'primary'}
                    text={'Delete message'}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.WHITE,
        flex:1,
        paddingTop: Spacing.SPACING_4,
    },
    card: {
        flex:1,
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
    footer: {
        paddingHorizontal: Spacing.SPACING_4,
        paddingBottom: Spacing.SPACING_5
    }
})

export default MessagesDetailsScreen
