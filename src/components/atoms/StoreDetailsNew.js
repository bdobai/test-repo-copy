import React from 'react';
import { View, Text, StyleSheet, Image, Linking, ScrollView } from "react-native";
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing, Typography } from "_styles";
import Button from "_atoms/Button";
import { dayStringFromNumber, formatTimeUTC} from "_utils/helpers";
import clockIcon from "_assets/images/stores/clock-orange.png";
import { visilabsApi } from "_utils/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StoreDetailsNew = (props) => {
    const { store, user } = props;

    const renderDaySchedule = (item) => {
        if(item.start_time === 0 && item.end_time === 0)
            return <Text style={styles.scheduleTime}>Open 24 Hours</Text>
        if(item.start_time === null && item.end_time === null)
            return <Text style={styles.scheduleTime}>CLOSED</Text>
        return (
            <>
                <Text style={styles.scheduleTime}>{formatTimeUTC(item.start_time)}</Text>
                <Text style={styles.scheduleTime}> - </Text>
                <Text style={styles.scheduleTime}>{formatTimeUTC(item.end_time)}</Text>
            </>
        )
    }

    const renderSchedule = () => {
        return store.store_hours?.data?.map((item, index) => {
            return <View key={index.toString()} style={styles.schedule}>
                <Text style={styles.day}>{dayStringFromNumber(item.day_of_week)}</Text>
                {renderDaySchedule(item)}
            </View>
        })
    }

    const onPressOrderOnline = async (store) => {
        let data = {
            "OM.orderOnline": 'Order online'
        };
        visilabsApi.customEvent("Press order online", data);
        const restaurant_uid = store.vendor_attribute[0].link.split('restaurant_uid=').pop();
        const url = `https://www.spoonityorder.com/ordering/restaurant/menu?restaurant_uid=${restaurant_uid}`;
        AsyncStorage.getItem('online_order_token').then((online_order_token) =>{
            console.debug('online order', online_order_token)
        const userUrl = url.concat(`&user_token=spoonity_${online_order_token}&user_token=spoonityloyality_${online_order_token}&user_token=spoonitycredit_${online_order_token}`)
            console.debug('user urk', userUrl);
        Linking.openURL(userUrl);
        }).catch((e) => Linking.openURL(url));
        // Linking.openURL(store.vendor_attribute[0].link)
    }

    const renderButton = () => {
        if(!store.vendor_attribute.length || !store.vendor_attribute[0].link) return;
        return <Button type={'outlinePrimary'} square={true} text={store.vendor_attribute[0]?.label} onPress={() => onPressOrderOnline(store)}/>
    }

    const renderIsOpen = () => {
        return <View style={[styles.row, {paddingHorizontal: Spacing.SPACING_4}]}>
            <Image source={clockIcon} style={styles.icon} resizeMode={'contain'} />
            <Text style={styles.closedText}>SCHEDULE </Text>
        </View>
    }

    const onCall = () => Linking.openURL(`tel:${store.phone_number}`)

    const renderPhoneNumber = () => {
        if(!store?.phone_number) return;
        return (
            <View style={[styles.row, {paddingHorizontal: Spacing.SPACING_4}]}>
                <View>
                    <Text style={styles.closedText}>PHONE NUMBER</Text>
                    <Text onPress={onCall}>{store.phone_number}</Text>
                </View>
            </View>
        )
    }

    return(
        <ScrollView style={styles.wrapper} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {renderPhoneNumber()}
            {renderIsOpen()}
            <View style={styles.row}>
                <View>
                    {renderSchedule()}
                </View>
            </View>
            <View style={{paddingHorizontal: Spacing.SPACING_4}}>
            <Button
                onPress={props.onDirections}
                text={'Direction'}
                block={true}
                type={'primary'}
                square={true}
                bodyStyle={styles.bodyStyle}
                textStyle={styles.textStyle}
            />
                {renderButton()}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Spacing.SPACING_4,
        height: 500,
    },
    name: {
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.PRIMARY,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.SPACING_2,
    },
    schedule:{
        paddingVertical: Spacing.SPACING_1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.SPACING_4
    },
    icon: {
        width: scaleSize(20),
        height: scaleSize(20),
        marginRight: Spacing.SPACING_2,
    },
    distance :{
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
    },
    email:{
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        marginTop: Spacing.SPACING_1,
    },
    address: {
      color: Colors.BLUE_GRAY,
      fontFamily: Typography.FONT_PRIMARY_REGULAR,
      fontSize: Typography.FONT_SIZE_14,
    },
    directions: {
        paddingVertical: Spacing.SPACING_1,
        paddingHorizontal: Spacing.SPACING_2,
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_16,
        backgroundColor: Colors.PRIMARY,
    },
    directionsWrapper: {
        overflow: 'hidden',
        borderRadius: scaleSize(24),
        alignSelf:'flex-start',
    },
    day: {
        width: scaleSize(60),
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_PRIMARY_REGULAR
    },
    scheduleTime: {
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_PRIMARY_REGULAR
    },
    contentContainer: {
        paddingBottom: scaleSize(50),
    },
    openText: {
        color: Colors.SUCCESS,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
    },
    closedText: {
        color: Colors.ERROR,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
    },
    bodyStyle:{marginBottom: Spacing.SPACING_4},
    textStyle:{fontFamily: Typography.FONT_PRIMARY_BOLD},
    sectionTitle :{
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
    },
})

export default StoreDetailsNew;
