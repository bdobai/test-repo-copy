import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking, ScrollView } from "react-native";
import MessageIcon from '_assets/images/stores/message.png';
import TimeIcon from '_assets/images/stores/time.png';
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing, Typography } from "_styles";
import Button from "_atoms/Button";
import { dayStringFromNumber, formatTimeUTC } from "_utils/helpers";

const StoreDetails = (props) => {
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
        return store.store_hours?.data?.map((item) => {
            return <View style={styles.row}>
                <Text style={styles.day}>{dayStringFromNumber(item.day_of_week)}</Text>
                {renderDaySchedule(item)}
            </View>
        })
    }

    const renderButton = () => {
        if(!store.vendor_attribute.length || !store.vendor_attribute[0].link) return;
        return <Button type={'outlinePrimary'} square={true} text={store.vendor_attribute[0]?.label} onPress={() => Linking.openURL(store.vendor_attribute[0].link)}/>
    }

    return(
        <ScrollView style={styles.wrapper}>
            <Text style={styles.name}>{store.name}</Text>
            <View style={styles.row}>
                <Image source={MessageIcon} style={styles.icon}/>
                <Text style={styles.sectionTitle}>CALL <Text style={{color: Colors.BLACK}}>{store.phone_number}</Text></Text>
            </View>
            <View style={styles.row}>
                <View style={styles.icon}/>
                <View style={[styles.row, {justifyContent:'space-between'}]}>
                    <View style={{marginRight: Spacing.SPACING_2}}>
                        <Text style={styles.sectionTitle}>EMAIL</Text>
                        <Text style={styles.email}>{store.email_address}</Text>
                    </View>
                    <Pressable onPress={props.onDirections} style={styles.directionsWrapper}>
                        <Text style={styles.directions}>Directions</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.row}>
                <Image source={TimeIcon} style={styles.icon}/>
                <Text style={styles.sectionTitle}>STORE HOURS</Text>
            </View>
            <View style={styles.row}>
                <View style={styles.icon}/>
                <View>
                    {renderSchedule()}
                </View>
            </View>
            {renderButton()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height:'100%',
        paddingHorizontal: Spacing.SPACING_4,
        paddingTop: Spacing.SPACING_4,
    },
    name: {
        fontSize: Typography.FONT_SIZE_18,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        paddingBottom: Spacing.SPACING_3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: Spacing.SPACING_2,
    },
    icon: {
        width: scaleSize(40),
        height: scaleSize(40),
    },
    sectionTitle :{
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
    },
    email:{
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_12,
        marginTop: Spacing.SPACING_1,
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
        borderRadius: scaleSize(24),
        overflow: 'hidden',
        backgroundColor: 'blue'
    },
    day: {
        width: scaleSize(60),
        color: Colors.BLUE_GRAY,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_PRIMARY_REGULAR
    },
    scheduleTime: {
        color: Colors.BLUE_GRAY,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_PRIMARY_REGULAR
    }
})

export default StoreDetails;
