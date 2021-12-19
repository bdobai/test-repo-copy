import React from 'react';
import { StyleSheet, Text, View, } from 'react-native'
import { Colors, Spacing, Typography } from '_styles'
import PropTypes from 'prop-types'
import { scaleSize } from '_styles/mixins'

const FormGroup = React.forwardRef((props, ref) => {

    return (
        <View
            style={[
                styles.container,
                props.styleInput,
                props.multiline === true ? { height: Typography.FONT_SIZE_18 * (props.numberOfLines ? props.numberOfLines : 1) } : null,
            ]}
        >
            {props.label ? <View>
                <Text style={[styles.labelStyle, props.styleLabel]}>{props.label}</Text>
            </View> : null}
            <View style={[styles.inputWrapper,props.inputWrapper, props.error ? styles.error : null,]}>
                {props.leftAccessory ? props.leftAccessory() : null}
                <View style={{flex: 1}}>
                    {props.children}
                </View>
                {props.rightAccessory ? props.rightAccessory() : null}
            </View>
            {(props.customError ? props.customError() : null )}
            {(props.customError ? null : props.error ? <Text style={styles.formGroupError}>{props.error}</Text> : (props.text ? <Text style={styles.formGroupText}>{props.text}</Text> : null))}
        </View>
    )
})

FormGroup.defaultProps = {
    withShadow: false,
    autoCorrect: false,
    leftAccessory: null,
    rightAccessory: null,
    styleInput: null,
    multiline: false,
    numberOfLines: 1,
}

FormGroup.propTypes = {
    label: PropTypes.string,
    text: PropTypes.string,
    styleInput: PropTypes.any,
    error: PropTypes.any,
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number,
    leftAccessory: PropTypes.any,
    rightAccessory: PropTypes.any,
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.SPACING_5,
    },
    inputWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: scaleSize(3),
        borderColor: Colors.MUTED,
        paddingTop: Spacing.SPACING_2,
        paddingBottom: Spacing.SPACING_2,
    },
    error: {
        borderColor: Colors.DANGER,
    },
    labelStyle: {
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        lineHeight: Typography.LINE_HEIGHT_14,
        fontWeight: '600',
        color: Colors.BLACK,
    },
    formGroupText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: 11,
        color: Colors.GRAY_DARK,
        lineHeight: Typography.LINE_HEIGHT_10,
    },
    formGroupError: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: 11,
        color: Colors.DANGER,
        lineHeight: Typography.LINE_HEIGHT_10,
        position: 'absolute',
        bottom: scaleSize(-16),
    }
})

export default FormGroup
