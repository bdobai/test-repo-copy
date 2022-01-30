import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";
import Radio from "_atoms/Radio";
import MasterCard from '_assets/images/account/mastercard.svg'
import VisaCard from '_assets/images/account/visa.svg'
import AmexCard from '_assets/images/account/amex.svg'
import { scaleSize } from "_styles/mixins";
import { dateFormat } from "_utils/helpers";
import { Colors, Spacing, Typography } from "_styles";
import CloseIcon from "_assets/images/close.svg";

const CARD_WIDTH = scaleSize(50);
const CARD_HEIGHT = scaleSize(35)

const CreditCardListItem = (props) => {

    const renderCardIcon = () => {
        switch (props.item.type){
            case 'MasterCard':
                return <MasterCard style={styles.card} width={CARD_WIDTH} height={CARD_HEIGHT}/>
            case 'Visa':
                return <VisaCard style={styles.card} width={CARD_WIDTH} height={CARD_HEIGHT}/>
            case 'American Express':
                return <AmexCard style={styles.card} width={CARD_WIDTH} height={CARD_HEIGHT}/>
            default:
                return <MasterCard style={styles.card} width={CARD_WIDTH} height={CARD_HEIGHT}/>

        }
    }

    const onPressDelete = () => {
        props.onPressDelete(props.item)
    }

    const onPress = () => {
        props.onPress(props.item)
    }

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.row}>
                <Radio value={false} selectedValue={true}/>
                {renderCardIcon()}
                <View>
                    <Text style={styles.text}>{props.item.name}</Text>
                    <Text style={styles.text}>{props.item.card}</Text>
                    <Text style={styles.text}>{`valid thru ${dateFormat(props.item.expiry, 'MM/YYYY')}`}</Text>
                </View>
            </View>
            <Pressable onPress={onPressDelete} hitSlop={{top: scaleSize(10), bottom: scaleSize(10), left:scaleSize(10), right: scaleSize(10)}}>
                <CloseIcon width={scaleSize(12)} height={scaleSize(12)} fill={Colors.BLACK}/>
            </Pressable>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_7,
        justifyContent: 'space-between'
    },
    card: {
        marginHorizontal: Spacing.SPACING_4
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text:{
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.BLACK
    }
})

export default CreditCardListItem
