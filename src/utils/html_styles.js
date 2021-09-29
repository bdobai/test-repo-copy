import { Colors, Spacing, Typography } from '_styles'

export const HTMLStyles = {
    ignoredStyles: ['display', 'width', 'height', 'fontFamily', 'padding', 'textStyle'],
    baseFontStyle: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_20,
        color: Colors.WHITE,
    },
    classesStyles:{
    },
    tagsStyles: {
        body: {
            marginTop: 24,
            fontFamily: Typography.FONT_PRIMARY_REGULAR
        },
        a: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            fontWeight: 'normal',
            textDecorationLine: 'none',
            color: Colors.WHITE
        },
        p: {
            textAlign: 'justify',
            paddingBottom: Spacing.SPACING_2
        },
        em: {
            fontFamily: Typography.FONT_PRIMARY_REGULAR,
            // fontStyle: 'normal'
        },
        li: {
            fontFamily: Typography.FONT_PRIMARY_REGULAR
        },
        b: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            // fontWeight: 'normal',
        },
        strong: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            // fontWeight: 'normal',
        },
        h1: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            // fontWeight: 'normal',
            paddingBottom: Spacing.SPACING_3,
            color: Colors.WHITE,
            fontSize: Typography.FONT_SIZE_16,
            lineHeight: Typography.LINE_HEIGHT_16,
        },
        h2: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            // fontWeight: 'normal',
            paddingBottom: Spacing.SPACING_3,
            color: Colors.WHITE,
            fontSize: Typography.FONT_SIZE_12,
            lineHeight: Typography.LINE_HEIGHT_12,
        },
        h3: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            // fontWeight: 'normal',
            fontSize: Typography.FONT_SIZE_16,
            lineHeight: Typography.LINE_HEIGHT_16,
            paddingBottom: Spacing.SPACING_2,
            color: Colors.WHITE
        },
        h4: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            // fontWeight: 'normal',
            paddingBottom: Spacing.SPACING_2,
            color: Colors.WHITE
        },
        h5: {
            fontFamily: Typography.FONT_PRIMARY_BOLD,
            // fontWeight: 'normal',
            paddingBottom: Spacing.SPACING_2,
            color: Colors.WHITE
        },
        img: {maxWidth: '100%'},
    }
};
