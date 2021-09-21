import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import Theme from '../themes/Theme'

const TabLabel = (props) => {
    return <View style={[styles.textContainer, props.containerStyle, props.focused ? { opacity: 1 } : null]}>
        <Text style={[styles.text, props.focused ? styles.focused : null]} source={props.text}>{props.text}</Text>
    </View>
}

TabLabel.propTypes = {
    containerStyle: PropTypes.any,
    focused: PropTypes.bool,
    counter: PropTypes.number,
}
const styles = StyleSheet.create({
    focused: {
        opacity: 1,
        color: Theme.Colors.primary,
    },
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5
    },
    text: {
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        color: '#707070',
        fontSize: 11,
        marginBottom: 1.5
    },
})

export default TabLabel
