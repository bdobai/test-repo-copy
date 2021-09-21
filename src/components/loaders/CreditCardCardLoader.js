import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Spacing } from '../../styles/index.js'
import Card from '_atoms/Card'
import { scaleSize } from '_styles/mixins'
import Shimmer from '_atoms/Shimmer'

const CreditCardCardLoader = (props) => {
    return <Card style={[styles.container, props.style]}>
        <View style={styles.cardBody}>
            <Shimmer width={250} style={{marginBottom: Spacing.SPACING_1}} height={scaleSize(20)}/>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Shimmer width={100} height={scaleSize(15)}/>
                <Shimmer width={50} height={scaleSize(15)}/>
            </View>
        </View>
    </Card>
}

const styles = StyleSheet.create({
    container: {
        height: scaleSize(65),
        padding: 0,
        borderWidth: 0,
        flexDirection: 'column',
        overflow: 'hidden',
        marginBottom: Spacing.SPACING_2
    },
    cardBody: {
        overflow: 'hidden',
        margin: Spacing.SPACING_3,
        flexDirection: 'column',
    },
})

export default CreditCardCardLoader
