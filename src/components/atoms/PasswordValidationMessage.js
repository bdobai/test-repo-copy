import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native'
import { Colors, Spacing, Typography } from "_styles";
import { scaleSize } from "_styles/mixins";
import SuccessIcon from '_assets/images/alerts/success.svg'
import ErrorIcon from '_assets/images/alerts/error.svg'

export const PasswordValidationMessage = (props) => {

    const color = props.validator(props.value) ? 'green' :'red'
    const renderIcon = () => {
        if (props.validator(props.value))
            return <SuccessIcon width={scaleSize(14)} height={scaleSize(14)} fill={Colors.WHITE} style={{backgroundColor:Colors.WHITE}} />
        return <ErrorIcon width={scaleSize(14)} height={scaleSize(14)} fill={Colors.ERROR}/>
    }

    return (
            <View style={styles.row}>
                {renderIcon()}
                <Text style={[styles.text, {color}]}>{props.label}</Text>
            </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.SPACING_2
    },
    text: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_14,
        marginLeft: Spacing.SPACING_2
    }

})
