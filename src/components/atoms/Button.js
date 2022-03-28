import React, { Component } from 'react'
import { ActivityIndicator, Image, Keyboard, StyleSheet, Text, Pressable, View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Radius, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'

class Button extends Component {
    getTextStyle () {
        let styles = base_styles.defaultText
        if (this.props.size && base_styles[this.props.size + 'Text']) {
            styles = [styles, base_styles[this.props.size + 'Text']]
        }
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
            }
        } else {
            color = '#000'
        }
        return color
    }

    getBodyStyle () {
        let styles = base_styles.defaultBody
        if (this.props.size && base_styles[this.props.size + 'Body']) {
            styles = [styles, base_styles[this.props.size + 'Body']]
        }
        if (this.props.type && base_styles[this.props.type + 'Body']) {
            styles = [styles, base_styles[this.props.type + 'Body']]
        }
        if (this.props.block) {
            styles = [styles, base_styles.blockBody]
        }
        if (this.props.bodyStyle) {
            styles = [styles, this.props.bodyStyle]
        }
        if (this.props.disabled) {
            styles = [styles, base_styles.disabledBody]
        }
        // if(this.props.square) {
        //     styles = [styles, base_styles.square]
        // }

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
        if (this.props.block) {
            styles = [styles, base_styles.blockBody]
        }
        if (this.props.bodyStyle) {
            styles = [styles, this.props.bodyStyle]
        }
        if (this.props.disabled) {
            styles = [styles, base_styles.disabledBody]
        }
        // if(this.props.square) {
        //     styles = [styles, base_styles. ]
        // }

        return styles
    }

    getLoadingStyle () {
        let styles = base_styles.defaultLoading;
        // if(this.props.square) {
        //     styles = [styles, base_styles.square]
        // }
        // if (this.props.type && base_styles[this.props.type + 'Body']){
        //     styles = [styles, base_styles[this.props.type + 'Body']];
        // }
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
            android_ripple={{color: this.props.type === 'secondary' ? Colors.PRIMARY + 40 : Colors.SECONDARY + 40}}

            disabled={this.props.disabled || this.props.loading}
            style={({pressed}) => pressed ? this.getBodyPressedStyle() : this.getBodyStyle()}
            onPress={() => this._handleOnPress()}
          >
              <View style={{flex: 1}}>
                  {this.props.loading ? (
                    <View style={this.getLoadingStyle()}>
                        <ActivityIndicator color={this.getLoaderColor()} style={{ flex: 1 }}/>
                    </View>
                  ) : null}
                  <Text style={this.getTextStyle()}>{this.props.text ? this.props.text : this.props.children}</Text>
              </View>
          </Pressable>
        )
    }
}

Button.propTypes = {
    style: PropTypes.any,
    text: PropTypes.string,
    loading: PropTypes.bool,
    block: PropTypes.bool,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
}

const base_styles = StyleSheet.create({
    smText: {
        fontSize: Typography.FONT_SIZE_20,
    },
    smBody: {
        paddingTop:0,
        paddingBottom:0,
        paddingLeft: scaleSize(12),
        paddingRight: scaleSize(12),
        height: scaleSize(35),
    },
    defaultText: {
        color: Colors.BLACK,
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_20,
        fontWeight: '700',
        fontFamily: Typography.FONT_PRIMARY_BOLD
    },
    defaultBody: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: scaleSize(13),
        paddingBottom: scaleSize(13),
        paddingLeft: Spacing.SPACING_5,
        paddingRight: Spacing.SPACING_5,
        borderWidth: 0,
        borderRadius: scaleSize(28),
        height: scaleSize(56),
        position: 'relative'

    },
    xsText: {
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
    },
    xsBody: {
        paddingLeft: 5,
        paddingRight: 5,
        height: scaleSize(22),
        paddingTop: 1,
        paddingBottom: 2,
    },
    lgText: {
        fontSize: Typography.FONT_SIZE_24,
        lineHeight: Typography.LINE_HEIGHT_24,
    },
    lgBody: {
        paddingTop: scaleSize(10),
        paddingBottom: scaleSize(10),
        paddingLeft: scaleSize(40),
        paddingRight: scaleSize(40),
        height: scaleSize(50),
    },
    inactiveText: {
        color: '#FFFFFF',
    },
    inactiveBody: {
        borderColor: '#D3D3D3',
        backgroundColor: '#D3D3D3',
    },
    lightText: {
        color: Colors.PRIMARY,
    },
    lightBody: {
        borderColor: Colors.GRAY_LIGHT,
        backgroundColor: Colors.GRAY_LIGHT,
    },
    lightBodyPressed: {
        borderColor: Colors.GRAY_LIGHT + '80',
        backgroundColor: Colors.GRAY_LIGHT + '80',
    },
    primaryText: {
        color: Colors.WHITE,
    },
    primaryBody: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.PRIMARY,
    },
    primaryBodyPressed: {
        borderColor: Colors.PRIMARY + '80',
        backgroundColor: Colors.PRIMARY + '80',
    },
    outlinePrimaryText: {
        color: Colors.PRIMARY,
        fontFamily: Typography.FONT_PRIMARY_BOLD
    },
    outlinePrimaryBody: {
        borderWidth: 2,
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.WHITE,
    },
    outlinePrimaryBodyPressed: {
        borderWidth: 1,
        borderColor: Colors.PRIMARY + '80',
        backgroundColor: 'transparent',
    },
    outlineSecondaryText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_BOLD
    },
    outlineSecondaryBody: {
        borderWidth: 1,
        borderColor: Colors.SECONDARY,
        backgroundColor: 'transparent',
    },
    outlineSecondaryBodyPressed: {
        borderWidth: 1,
        borderColor: Colors.SECONDARY,
        backgroundColor: Colors.SECONDARY,
    },
    secondaryText: {
        color: Colors.WHITE,
    },
    secondaryBody: {
        borderColor: Colors.SECONDARY,
        backgroundColor: Colors.SECONDARY,
    },
    secondaryBodyPressed: {
        borderColor: Colors.SECONDARY + '80',
        backgroundColor: Colors.SECONDARY + '80',
    },
    dangerText: {
        color: Colors.WHITE,
    },
    dangerBody: {
        borderColor: Colors.DANGER,
        backgroundColor: Colors.DANGER,
    },
    dangerBodyPressed: {
        borderColor: Colors.DANGER + '80',
        backgroundColor: Colors.DANGER + '80',
    },
    blockBody: {
        width: '100%',
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
        opacity: 0.5
    },
    square: {
        borderRadius: scaleSize(3)
    }
})

export default Button
