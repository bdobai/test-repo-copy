import * as React from 'react';
import { View, StyleSheet, Text, Image } from "react-native";
import { dateFormat } from "_utils/helpers";
import { Colors, Spacing, Typography } from "_styles";
import { WebView } from "react-native-webview";
import { scaleSize } from "_styles/mixins";

const MessagesDetailsScreen = (props) => {
    const {item} = props.route.params;
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
})

export default MessagesDetailsScreen
