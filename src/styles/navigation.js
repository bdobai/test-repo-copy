import { StyleSheet } from "react-native";
import { Colors, Typography } from "_base/styles/index";
import { scaleSize } from "_styles/mixins";

export const navigationStyles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.PRIMARY
    },
    whiteCardStyle:{
      backgroundColor: Colors.WHITE
    },
    whiteHeader: {
        borderWidth:0,
        elevation:0,
        shadowColor: Colors.WHITE,
        height: scaleSize(112),
    },
    primaryHeader: {
        backgroundColor:Colors.PRIMARY,
        borderColor: Colors.PRIMARY,
        shadowColor: Colors.PRIMARY,
        height: scaleSize(112),
    },
    headerTitle: {
        textTransform:'uppercase',
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        fontWeight:'700',
    },
    headerBackTitleStyle: {
        paddingLeft: 20
    },
    accountHeader: {
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontWeight:'700',
    }
})
