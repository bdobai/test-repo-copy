import React from 'react'
import { StyleSheet, Text, Pressable, View } from 'react-native'
import { Colors, Typography } from '../../styles'
import { scaleSize } from '_styles/mixins'
import { Spacing } from '_styles'
import PropTypes from 'prop-types'

const Radio = (props) => {
    return (
      <Pressable style={[styles.container, props.wrapperStyle]}  onPress={() => {props.onChange ? props.onChange(props.value) : null}}>
          <View style={styles.labelWrapper}>
              <View style={[styles.radioInput, props.selectedValue === props.value ? styles.radioInputChecked : null, [props.style]]}/>
              {props.label ? <Text style={[styles.radioLabel, props.selectedValue === props.value ? styles.radioLabelChecked : null]}>{props.label}</Text> : null}
              {props.children ? props.children : null}
          </View>
      </Pressable>
    )
}

Radio.propTypes = {
    label: PropTypes.string,
    style: PropTypes.any,
    wrapperStyle: PropTypes.any,
    onChange: PropTypes.any,
}

Radio.defaultTypes = {
    label: '',
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioInput: {
        width: scaleSize(20),
        height: scaleSize(20),
        borderRadius: scaleSize(10),
        borderWidth: scaleSize(5),
        borderColor: Colors.GRAY_MEDIUM,
        backgroundColor: Colors.GRAY_MEDIUM,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioInputChecked: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.WHITE,
    },
    radioLabel: {
        paddingLeft: Spacing.SPACING_2,
        color: Colors.GRAY_DARK,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    radioLabelChecked: {
        color: Colors.PRIMARY,
    },
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default Radio
