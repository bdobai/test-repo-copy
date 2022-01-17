import * as React from 'react';
import { View, Text, StyleSheet, Image, Linking, Pressable } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import openIcon from '_assets/images/stores/open.png';
import closedIcon from '_assets/images/stores/closed.png';
import { scaleSize } from "_styles/mixins";
import Button from "_atoms/Button";
import dayjs from "dayjs";
import { dateFormat, dateFormatLocal, formatTimeUTC } from "_utils/helpers";
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const StoreListItem = (props) => {
    const renderIsOpen = () => {
        let day = dayjs().day();
        if(day === 0){
            day = 7;
        }
        const dayOfWeek = props.item?.store_hours?.data?.find((item) => item.day_of_week === day)
        let until;
        if(dayOfWeek.end_time === 0){
            until = '24 Hours'
        }else {
            until = `until ${formatTimeUTC(dayOfWeek.end_time)}`
        }
        if(props.item.store_hours.is_open){
            return <View style={styles.openContainer}>
                <Image source={openIcon} style={styles.icon}/>
                <Text style={styles.openText}>OPEN</Text>
                <Text style={styles.until}>{`${until}`}</Text>
            </View>
        }
        return <View style={styles.openContainer}>
            <Image source={closedIcon} style={styles.icon}/>
            <Text style={styles.openText}>CLOSED</Text>
        </View>
    }

    const renderButton = () => {
        if(!props.item.vendor_attribute.length || !props.item.vendor_attribute[0].link) return;
        return <Button type={'outlinePrimary'} square={true} text={props.item.vendor_attribute[0]?.label} onPress={() => Linking.openURL(props.item.vendor_attribute[0].link)}/>
    }

    const onPress = () => props.onPress(props.item)

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{props.item.name}</Text>
            <Text style={styles.text}>{props.item.city}</Text>
            <Text style={styles.text}>{props.item.address_line_1}</Text>
            <Text style={styles.distance}>{`${props.item.distance?.toFixed(2)}km`}</Text>
            {renderIsOpen()}
            {renderButton()}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.SPACING_3,
        paddingHorizontal: Spacing.SPACING_4
    },
    text: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_16,
    },
    distance: {
        color: Colors.BLUE_GRAY,
        paddingTop: Spacing.SPACING_5,
    },
    openContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    openText: {
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14
    },
    icon: {
        width: scaleSize(36),
        height: scaleSize(36),
    },
    until: {
        color: Colors.BLUE_GRAY,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_14,
        paddingHorizontal: Spacing.SPACING_2,
    }
})

export default StoreListItem
