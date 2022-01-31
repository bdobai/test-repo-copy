import React from 'react'
import { StyleSheet, Text, Pressable, View } from 'react-native'
import { Colors, Typography } from '../../styles'
import { scaleSize } from '_styles/mixins'
import { Spacing } from '_styles'
import PropTypes from 'prop-types'

const Radio = (props) => {

    const renderInterior = () => {
        if(props.selectedValue !== props.value) return;
        return (
            <View style={styles.interiorCircle}/>
        )
    }

    return (
      <Pressable style={[styles.container, props.wrapperStyle]}  onPress={() => {props.onChange ? props.onChange(props.value) : null}}>
          <View style={styles.labelWrapper}>
              <View style={[styles.radioInput, props.selectedValue === props.value ? styles.radioInputChecked : null, [props.style]]}>
                  {renderInterior()}
              </View>
              {props.label ? <Text style={[styles.radioLabel, props.selectedValue === props.value ? styles.radioLabelChecked : null, props.labelStyle]}>{props.label}</Text> : null}
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
        width: scaleSize(24),
        height: scaleSize(24),
        borderRadius: scaleSize(12),
        borderWidth: scaleSize(1),
        borderColor: Colors.BLACK,
        // backgroundColor: Colors.GRAY_MEDIUM,
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    interiorCircle: {
        backgroundColor: Colors.BLACK,
        width: scaleSize(14),
        height: scaleSize(14),
        borderRadius: scaleSize(7),
    }
})

export default Radio
