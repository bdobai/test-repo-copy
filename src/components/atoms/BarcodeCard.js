import { Image, Text, View, StyleSheet } from "react-native";
import React from "react";
import { scaleSize } from "_styles/mixins";
import { Colors, Spacing } from "_styles";
import Spinner from "_atoms/Spinner";

const BarcodeCard = (props) => {
    const { barcode, loading } = props
    return (
        <View style={styles.barcodeCard}>
            {loading ? <Spinner color={Colors.PRIMARY} /> :
                <Image key={barcode} source={{ uri: barcode?.barcode }} style={styles.barcode} />
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
        backgroundColor: '#FAFAFA',
        marginHorizontal: Spacing.SPACING_5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_4,
    },
})
