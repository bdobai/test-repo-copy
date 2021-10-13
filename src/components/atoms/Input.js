import React, { PureComponent } from 'react'
import { Image, StyleSheet, Text, TextInput, Pressable, View, } from 'react-native'
import { Colors, Radius, Spacing, Typography } from '../../styles'
import PropTypes from 'prop-types'
import { scaleSize } from '../../styles/mixins'

const showPassword = null
const hidePassword = null

class Input extends PureComponent {

    constructor (props) {
        super(props)
        this.state = { passwordHide: props.secureTextEntry }
    }

    render () {
        let props = this.props
        return (
          <View
            style={[
                styles.container,
                props.styleInput,
                props.error ? styles.error : null,
                props.hasFocus ? styles.focus : null,
                props.multiline === true ? { height: 20 * (props.numberOfLines ? props.numberOfLines : 1) } : null,
            ]}
          >
              {props.label !== undefined ? <View>
                  <Text style={[styles.labelStyle, props.styleLabel]}>{props.label}</Text>
              </View> : null}
              <TextInput
                allowFontScaling={false}
                secureTextEntry={this.state.passwordHide}
                autoCorrect={props.autoCorrect}
                style={[
                    props.inputStyle ? props.inputStyle : styles.inputStyle,
                    props.editable === false ? styles.disabled : null,
                    props.multiline === true ? { textAlignVertical: 'top', height: 20 * (props.numberOfLines ? props.numberOfLines : 1) } : null,
                ]}
                value={props.value}
                keyboardType={props.keyboardType}
                onChangeText={props.onChangeText}
                underlineColorAndroid="rgba(0,0,0,0)"
                multiline={props.multiline}
                onBlur={props.onBlur}
                numberOfLines={props.numberOfLines}
                onSubmitEditing={props.onSubmitEditing}
                ref={props.inputRef}
                editable={props.editable}
                selectTextOnFocus={false}
                autoCapitalize={props.autoCapitalize}
                onFocus={props.onFocus}
                onChange={props.onChange}
                textContentType={props.textContentType}
                returnKeyType={props.returnKeyType}
              />
              {props.secureTextEntry ? (
                <Pressable
                  onPress={() => {
                      this.setState({ passwordHide: !this.state.passwordHide })
                  }}
                >
                    <Image source={this.state.passwordHide ? hidePassword : showPassword} style={styles.passwordImage}/>
                </Pressable>
              ) : null}
              {(props.text ? <Text style={styles.formGroupText}>{props.text}</Text> : null)}
          </View>
        )
    }
}

Input.defaultProps = {
    withShadow: false,
    autoCorrect: false,
}

Input.propTypes = {
    secureTextEntry: PropTypes.bool,
    editable: PropTypes.bool,
    disabled: PropTypes.bool,
    image: PropTypes.any,
    styleInput: PropTypes.any,
    styleLabel: PropTypes.any,
    value: PropTypes.any,
    name: PropTypes.string,
    multiline: PropTypes.bool,
    onBlur: PropTypes.func,
    numberOfLines: PropTypes.number,
    onSubmitEditing: PropTypes.func,
    inputRef: PropTypes.func,
    autoCapitalize: PropTypes.string,
    onEndEditing: PropTypes.func,
    keyboardType: PropTypes.string,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onChangeText: PropTypes.func,
    error: PropTypes.bool,
    textContentType: PropTypes.string,
    hasFocus: PropTypes.bool,
    placeholderTextColor: PropTypes.string,
    withShadow: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    onPress: PropTypes.func,
    returnKeyType: PropTypes.string,
    inputStyle: PropTypes.any,
    label: PropTypes.string,
    text: PropTypes.string,
    notes: PropTypes.string,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    focus: {},
    error: {
        borderColor: Colors.DANGER,
    },
    passwordImage: {
        marginLeft: Spacing.SPACING_1,
        marginRight: Spacing.SPACING_1,
        height: scaleSize(22),
        width: scaleSize(22),
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    inputStyle: {
        paddingTop: Spacing.SPACING_1,
        paddingBottom: Spacing.SPACING_1,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        flex: 1,
        paddingLeft: Spacing.SPACING_4,
        paddingRight: Spacing.SPACING_5,
        borderRadius: Radius.RADIUS_1,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GREY,
        height: scaleSize(59),

    },
    disabled: {
        backgroundColor: Colors.GRAY_LIGHT,
        height: 38,
    },
    notes: {
        marginTop: 2,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_12,
        minHeight: scaleSize(16),
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
    },
    labelStyle: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        flex: 1,
        lineHeight: Typography.LINE_HEIGHT_12,
        marginVertical: scaleSize(13),
        color: Colors.WARM_GREY,
        paddingLeft: scaleSize(3)
    },
    formGroupText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: 11,
        color: Colors.GRAY_DARK,
        lineHeight: Typography.LINE_HEIGHT_10,
    }
})

export default Input
