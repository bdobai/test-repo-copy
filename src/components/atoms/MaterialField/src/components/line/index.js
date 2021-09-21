import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Animated, View } from 'react-native'

import styles from './styles'
import { Colors } from '_styles'

const lineTypes = PropTypes
  .oneOf(['solid', 'dotted', 'dashed', 'none'])

export default class Line extends PureComponent {
    static defaultProps = {
        lineType: 'solid',
        disabledLineType: 'dotted',

        disabled: false,
        restricted: false,
    }

    static propTypes = {
        lineType: lineTypes,
        disabledLineType: lineTypes,

        disabled: PropTypes.bool,
        restricted: PropTypes.bool,

        tintColor: PropTypes.string,
        baseColor: PropTypes.string,
        errorColor: PropTypes.string,

        lineWidth: PropTypes.number,
        activeLineWidth: PropTypes.number,
        disabledLineWidth: PropTypes.number,

        focusAnimation: PropTypes.instanceOf(Animated.Value),
    }
    state = { maxLineWidth: 1 }

    static getDerivedStateFromProps (props, state) {
        let { lineWidth, activeLineWidth, disabledLineWidth } = props

        let maxLineWidth = Math.max(
          lineWidth,
          activeLineWidth,
          disabledLineWidth,
          1,
        )

        if (maxLineWidth !== state.maxLineWidth) {
            return { maxLineWidth }
        }

        return null
    }

    borderProps () {
        let {
            disabled,
            restricted,
            lineWidth,
            activeLineWidth,
            disabledLineWidth,
            baseColor,
            tintColor,
            errorColor,
            focusAnimation,
        } = this.props

        if (disabled) {
            return {
                borderColor: Colors.GRAY_MEDIUM,
                borderWidth: disabledLineWidth,
            }
        }

        if (restricted) {
            return {
                borderColor: Colors.GRAY_MEDIUM,
                borderWidth: activeLineWidth,
            }
        }

        return {
            borderColor: focusAnimation.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [errorColor, Colors.GRAY_MEDIUM, tintColor],
            }),

            borderWidth: focusAnimation.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [activeLineWidth, lineWidth, activeLineWidth],
            }),
        }
    }

    render () {
        let { maxLineWidth } = this.state
        let { disabled, lineType, disabledLineType } = this.props

        let borderStyle = disabled ?
          disabledLineType :
          lineType

        if ('none' === borderStyle) {
            return null
        }

        let [top, right, left] = Array
          .from(new Array(3), () => -1.5 * maxLineWidth)

        let lineStyle = {
            ...this.borderProps(),

            borderStyle,
            top,
            right,
            left,
        }

        return (
          <View style={styles.container} pointerEvents='none'>
              <Animated.View style={[styles.line, lineStyle]}/>
          </View>
        )
    }
}
