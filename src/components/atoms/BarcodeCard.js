import { Image, Text, View, StyleSheet } from "react-native";
import React from "react";
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing, Typography } from "_styles";
import Spinner from "_atoms/Spinner";

const BarcodeCard = (props) => {
    const { barcode, loading } = props
    return (
        <View style={styles.barcodeCard}>
            {loading ? <Spinner color={Colors.PRIMARY} /> :
                <View>
                    <Image key={barcode} source={{ uri: barcode?.barcode }} style={styles.barcode} resizeMode={'stretch'}/>
                    <Text style={styles.text}>{barcode.token}</Text>
                </View>
            }
        </View>
    )
}

export default BarcodeCard

const styles = StyleSheet.create({
    barcode: {
        width: scaleSize(225),
        height: scaleSize(75),
    },
    barcodeCard: {
        marginHorizontal: Spacing.SPACING_5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_4,
    },
    text: {
        alignSelf: 'center',
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        paddingTop: Spacing.SPACING_1,
        fontSize: Typography.FONT_SIZE_12,
    }
})
