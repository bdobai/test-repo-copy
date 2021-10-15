import { StyleSheet } from 'react-native'
import { Typography, Spacing } from '_styles'

export default StyleSheet.create({
    text: {
        flex: 1,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        minHeight: Typography.LINE_HEIGHT_16,
        backgroundColor: 'transparent',
        paddingVertical: 2,
        textAlign: 'left',
        fontFamily: Typography.FONT_PRIMARY_MEDIUM,
        // paddingTop: Spacing.SPACING_3
    },
})
