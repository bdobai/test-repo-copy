import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking, ScrollView } from "react-native";
import TimeIcon from '_assets/images/stores/time.png';
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing, Typography } from "_styles";
import Button from "_atoms/Button";
import { dayStringFromNumber, formatTimeUTC, getNextOpen, getOpenUntil } from "_utils/helpers";
import markerIcon from "_assets/images/stores/marker-new.png";
import clockIcon from "_assets/images/stores/clock-orange.png";
import personIcon from "_assets/images/stores/person-orange.png";
import pinIcon from "_assets/images/stores/pin-orange.png";

const StoreDetailsNew = (props) => {
    const { store } = props;

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
            return <View key={index.toString()} style={[styles.row, {paddingVertical: Spacing.SPACING_1}]}>
                <Text style={styles.day}>{dayStringFromNumber(item.day_of_week)}</Text>
                {renderDaySchedule(item)}
            </View>
        })
    }

    const renderButton = () => {
        if(!store.vendor_attribute.length || !store.vendor_attribute[0].link) return;
        return <Button type={'outlinePrimary'} square={true} text={store.vendor_attribute[0]?.label} onPress={() => Linking.openURL(store.vendor_attribute[0].link)}/>
    }

    const renderIsOpen = () => {
        if(store?.store_hours.is_open) {
            return <View style={styles.row}>
                <Image source={clockIcon} style={styles.icon} resizeMode={'contain'} />
                <Text style={styles.openText}>SCHEDULE </Text>
                {/*<Text style={styles.distance}>{getOpenUntil(store)}</Text>*/}
            </View>
        }
        return <View style={[styles.row, {paddingHorizontal: Spacing.SPACING_4}]}>
            <Image source={clockIcon} style={styles.icon} resizeMode={'contain'} />
            <Text style={styles.closedText}>SCHEDULE </Text>
            {/*<Text style={styles.distance}>{`${dayStringFromNumber(getNextOpen(store)?.day_of_week)} ${formatTimeUTC(getNextOpen(store)?.start_time)}`}</Text>*/}
        </View>
    }

    return(
        <ScrollView style={styles.wrapper} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/*<View style={styles.row}>*/}
            {/*    <Image source={markerIcon} style={styles.icon} resizeMode={'contain'}/>*/}
            {/*    <Text numberOfLines={2} style={styles.name}>{store.name}</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.row}>*/}
            {/*    <Image source={pinIcon} style={styles.icon} resizeMode={'contain'}/>*/}
            {/*    <Text style={styles.address}>{`${store.city} ${store.address_line_1}`}</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.row}>*/}
            {/*    <Image source={personIcon} style={styles.icon} resizeMode={'contain'}/>*/}
            {/*    <Text style={styles.distance}>{`${store.distance.toFixed(2)} km`}</Text>*/}
            {/*</View>*/}
            {renderIsOpen()}
            <View style={styles.row}>
                <View style={styles.icon}/>
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
            </View>
            {renderButton()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        // paddingHorizontal: Spacing.SPACING_4,
        paddingTop: Spacing.SPACING_4,
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
    textStyle:{fontFamily: Typography.FONT_PRIMARY_BOLD}
})

export default StoreDetailsNew;
