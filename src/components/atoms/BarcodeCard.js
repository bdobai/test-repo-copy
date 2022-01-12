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
                <>
                    <Image key={barcode} source={{ uri: barcode?.barcode }} style={styles.barcode} />
                    <Text style={styles.token}>{barcode?.token}</Text>
                </>
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
        backgroundColor: Colors.WHITE,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: Spacing.SPACING_10,
        justifyContent: 'center',
        alignItems: 'center',
        height: scaleSize(160),
        marginBottom: Spacing.SPACING_8,
    },
    token: {
        position: 'absolute',
        bottom: Spacing.SPACING_2,
        color: Colors.BLUE_GRAY
    }
})
