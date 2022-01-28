import { View, StyleSheet, Text } from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Colors, Spacing, Typography } from "_styles";
import Button from "_atoms/Button";
import CheckBox from "_atoms/CheckBox";

const StoresFilters = forwardRef((props, ref) => {
    const [availability, setAvailability] = useState(false)
    const [onlineOrdering, setOnlineOrdering] = useState(false)

    useImperativeHandle(ref, () => ({
        getData () {
            return {
                availability,
                onlineOrdering
            }
        }
    }));

    const onSave = () => {
        props.onSave(availability, onlineOrdering)
    }

    const onPressOpen = () => {
        setAvailability(!availability);
    }

    const onPressOnline = () => {
        setOnlineOrdering(!onlineOrdering);
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>Filters</Text>
                <Text style={styles.clearAll}>Clear All</Text>
            </View>
            <CheckBox
                checked={true}
                type={'square'}
                label={'Open now'}
                style={{borderColor: Colors.BLACK}}
                labelStyle={styles.checkBoxLabel}
                onPress={onPressOpen}
            />
            <CheckBox
                type={'square'}
                label={'Accepting online order'}
                style={{borderColor: Colors.BLACK}}
                labelStyle={styles.checkBoxLabel}
                onPress={onPressOnline}
            />
            <Button
                onPress={onSave}
                block={true}
                type={'primary'}
                text={'Save filters'}
                bodyStyle={styles.button}
            />
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        padding: Spacing.SPACING_4
    },
    title: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: 20
    },
    radioButton: {
        marginTop: Spacing.SPACING_1
    },
    button: {
        marginTop: Spacing.SPACING_4
    },
    checkBoxLabel:{
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_14,
    },
    clearAll: {
        // alignSelf: 'flex-end',
        color: Colors.BLUE_GRAY,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: 20,
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: Spacing.SPACING_2,
    }
})

export default StoresFilters
