import * as React from 'react';
import {Text, StyleSheet} from 'react-native';
import { Colors, Spacing, Typography } from "_styles";

export const AuthHeaderText = (props) => {
    return(
        <Text style={styles.title}>{props.text}</Text>
    )
}

const styles = StyleSheet.create({
    title: {
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_22,
        alignSelf:'center',
        marginTop: Spacing.SPACING_4,
        marginBottom: Spacing.SPACING_6,
        fontFamily:Typography.FONT_SECONDARY_BOLD,
        fontWeight: 'bold',
    },
})
