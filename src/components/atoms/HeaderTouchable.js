import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { scaleSize } from '_styles/mixins'

const HeaderTouchable = props => {

    return <Pressable style={styles.wrapper}  onPress={() => props.onPress ? props.onPress : null}>
        {props.children}
    </Pressable>
}

const styles = StyleSheet.create({
    wrapper: {
        minWidth: scaleSize(50),
        minHeight: scaleSize(50),
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default HeaderTouchable
