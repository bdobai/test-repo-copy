import React, { Component } from 'react'
import { ActivityIndicator, Keyboard, StyleSheet, Text, Pressable, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'

class ButtonRounded extends Component {

    getTextStyle () {
        let styles = base_styles.defaultText
        if (this.props.type && base_styles[this.props.type + 'Text']) {
            styles = [styles, base_styles[this.props.type + 'Text']]
        }
        if (this.props.textStyle) {
            styles = [styles, this.props.textStyle]
        }
        if (this.props.loading) {
            styles = [styles, { opacity: 0 }]
        }
        return styles
    }

    getLoaderColor () {
        let color = '#fff'
        if (this.props.type) {
            switch (this.props.type) {
                case 'white': {
                    color = '#000'
                    break
                }
                case 'outlineLight': {
                    color = Colors.GRAY_LIGHT
                    break
                }
                case 'outlineDanger': {
                    color = Colors.DANGER
                    break
                }
            }
        } else {
            color = '#000'
        }
        return color
    }

    getBodyStyle () {
        let styles = base_styles.defaultBody
        if (this.props.type && base_styles[this.props.type + 'Body']) {
            styles = [styles, base_styles[this.props.type + 'Body']]
        }
        if (this.props.bodyStyle) {
            styles = [styles, this.props.bodyStyle]
        }

        return styles
    }

    getBodyPressedStyle () {
        let styles = base_styles.defaultBody
        if (this.props.size && base_styles[this.props.size + 'Body']) {
            styles = [styles, base_styles[this.props.size + 'Body']]
        }
        if (this.props.type && base_styles[this.props.type + 'BodyPressed']) {
            styles = [styles, base_styles[this.props.type + 'BodyPressed']]
        }
        if (this.props.bodyStyle) {
            styles = [styles, this.props.bodyStyle]
        }

        return styles
    }

    _handleOnPress () {
        Keyboard.dismiss
        if (this.props.onPress) {
            this.props.onPress()
        }
    }

    render () {
        return (
          <Pressable
            unstable_pressDelay={100}
            disabled={this.props.disabled || this.props.loading}
            style={({pressed}) => pressed ? this.getBodyPressedStyle() : this.getBodyStyle()}
            onPress={() => this._handleOnPress()}
          >
              <View>
                  {this.props.loading ? (
                    <View style={base_styles.defaultLoading}>
                        <ActivityIndicator color={this.getLoaderColor()} style={{ flex: 1 }}/>
                    </View>
                  ) : null}
                  <Text style={this.getTextStyle()}>{this.props.text ? this.props.text : this.props.children}</Text>
              </View>
          </Pressable>
        )
    }
}

ButtonRounded.propTypes = {
    style: PropTypes.any,
    text: PropTypes.string,
    loading: PropTypes.bool,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
}

const base_styles = StyleSheet.create({
    defaultText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        color: Colors.MUTED,
    },
    defaultBody: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Spacing.SPACING_1,
        paddingBottom: Spacing.SPACING_1,
        paddingLeft: Spacing.SPACING_4,
        paddingRight: Spacing.SPACING_4,
        borderWidth: 1,
        borderColor: Colors.MUTED,
        borderRadius: scaleSize(15),
        height: scaleSize(30),
    },
    inactiveText: {
        color: '#FFFFFF',
    },
    inactiveBody: {
        borderColor: '#D3D3D3',
        backgroundColor: '#D3D3D3',
    },
    outlineLightText: {
        color: Colors.GRAY_LIGHT,
    },
    outlineLightTextPressed: {
        color: Colors.GRAY_LIGHT + '80',
    },
    outlineLightBody: {
        borderColor: Colors.GRAY_LIGHT,
        backgroundColor: 'transparent',
    },
    outlineLightBodyPressed: {
        borderColor: Colors.GRAY_LIGHT + '80',
        backgroundColor: 'transparent',
    },
    lightText: {
        color: Colors.SECONDARY,
    },
    lightBody: {
        borderColor: Colors.WHITE,
        backgroundColor: Colors.WHITE,
    },
    lightBodyPressed: {
        borderColor: Colors.GRAY_LIGHT,
        backgroundColor: Colors.WHITE,
    },
    primaryText: {
        color: Colors.WHITE,
    },
    primaryTextPressed: {
        color: Colors.WHITE + '80',
    },
    primaryBody: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.PRIMARY,
    },
    primaryBodyPressed: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.PRIMARY + '80',
    },
    outlinePrimaryText: {
        color: Colors.PRIMARY,
    },
    outlinePrimaryTextPressed: {
        color: Colors.PRIMARY + '80',
    },
    outlinePrimaryBody: {
        borderColor: Colors.PRIMARY,
    },
    outlinePrimaryBodyPressed: {
        borderColor: Colors.PRIMARY + '80',
    },
    secondaryText: {
        color: Colors.WHITE,
    },
    secondaryBody: {
        borderColor: Colors.SECONDARY,
        backgroundColor: Colors.SECONDARY,
    },
    dangerText: {
        color: Colors.WHITE,
    },
    dangerBody: {
        borderColor: Colors.DANGER,
        backgroundColor: Colors.DANGER,
    },
    outlineDangerText: {
        color: Colors.DANGER,
    },
    outlineDangerBody: {
        borderColor: Colors.DANGER,
    },
    defaultLoading: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    disabledText: {
        color: Colors.WHITE,
    },
    disabledBody: {
        backgroundColor: Colors.WHITE,
        borderColor: Colors.WHITE,
    },
})

export default ButtonRounded
