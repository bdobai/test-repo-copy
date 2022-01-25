import * as React from 'react';
import { View, Text, StyleSheet, Image, Linking, Pressable } from "react-native";
import { Colors, Spacing, Typography } from "_styles";
import { scaleSize } from "_styles/mixins";
import Button from "_atoms/Button";
import { dayStringFromNumber, formatTimeUTC, getNextOpen, getOpenUntil } from "_utils/helpers";
import markerIcon from "_assets/images/stores/marker-new.png";
import RightChevron from "_assets/images/right-chevron.svg";

const StoreListItemNew = (props) => {
    const renderIsOpen = () => {
        if(props.item.store_hours.is_open){
            return <View style={styles.openContainer}>
                <Text style={styles.openText}>OPEN</Text>
                <Text style={styles.until}>{getOpenUntil(props.item)}</Text>
            </View>
        }
        return <View style={styles.openContainer}>
            <Text style={styles.closedText}>CLOSED: Opens</Text>
            <Text style={styles.until}>{`${dayStringFromNumber(getNextOpen(props.item)?.day_of_week)} ${formatTimeUTC(getNextOpen(props.item)?.start_time)}`}</Text>
        </View>
    }

    const renderButton = () => {
        if(!props.item.vendor_attribute.length || !props.item.vendor_attribute[0].link) return;
        return <Button bodyStyle={styles.smallButton} type={'primary'} square={true} size={'sm'} bodyStyle={styles.smallButton} text={props.item.vendor_attribute[0]?.label} onPress={() => Linking.openURL(props.item.vendor_attribute[0].link)}/>
    }

    const onPress = () => props.onPress(props.item)

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.contentWrapper}>
                <View style={{flex:0.9}}>
                    <View style={styles.titleWrapper}>
                        <Image resizeMode={'contain'} source={markerIcon} style={styles.pinIcon}/>
                        <Text style={styles.title}>{props.item.name}</Text>
                    </View>
                    <Text numberOfLines={1} style={styles.text}>{`${props.item.city}, ${props.item.address_line_1}`}</Text>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>{`${props.item.distance?.toFixed(2)} km | `}</Text>
                        {renderIsOpen()}
                    </View>
                </View>
                <RightChevron width={scaleSize(20)} height={scaleSize(20)} fill={Colors.PRIMARY}/>
            </View>
            {renderButton()}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.SPACING_3,
        paddingHorizontal: Spacing.SPACING_4,
    },
    contentWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.SPACING_1,
    },
    pinIcon: {
      width: scaleSize(16),
      height: scaleSize(16),
      marginRight: Spacing.SPACING_2,
    },
    title: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_14,
    },
    text: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLACK,
        fontSize: Typography.FONT_SIZE_14,
    },
    distance: {
        color: Colors.BLUE_GRAY,
    },
    openContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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
    icon: {
        width: scaleSize(36),
        height: scaleSize(36),
    },
    until: {
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        paddingHorizontal: Spacing.SPACING_1,
    },
    smallButton: {
        width: scaleSize(225),
        height: scaleSize(35),
        marginTop: Spacing.SPACING_1,
        alignSelf: 'center'
    },
})

export default StoreListItemNew
