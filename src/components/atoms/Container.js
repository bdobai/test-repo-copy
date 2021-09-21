import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Spacing } from '../../styles'

const Container = props => {
    return (
      <View style={[styles.container, props.style]}>
          {props.children}
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: Spacing.SPACING_5,
        paddingRight: Spacing.SPACING_5,
    },
})

export default Container
