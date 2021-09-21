import React, { memo, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { LayoutAnimation, Platform, StyleSheet, Text, UIManager, View, } from 'react-native'
import { Colors, Typography } from '_styles'

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
}

const readmoreAnimation = LayoutAnimation.create(
  300,
  LayoutAnimation.Types.easeInEaseOut,
  LayoutAnimation.Properties.opacity,
)

const ReadMore = ({
    numberOfLines,
    style,
    wrapperStyle,
    children,
    seeMoreStyle,
    seeMoreText,
    seeLessStyle,
    seeLessText,
    animate,
    backgroundColor,
    customTextComponent: TextComponent,
    ellipsis,
    allowFontScaling,
    onExpand,
    onCollapse,
    expandOnly,
    ...restProps
}) => {
    const [textHeight, setTextHeight] = useState(0)
    const [hiddenTextHeight, setHiddenTextHeight] = useState(0)
    const [
        hiddenTextHeightWithSeeLess,
        setHiddenTextHeightWithSeeLess,
    ] = useState(0)
    const [mountHiddenTextOne, setMountHiddenTextOne] = useState(true)
    const [mountHiddenTextTwo, setMountHiddenTextTwo] = useState(true)
    const [seeMore, setSeeMore] = useState(false)
    const [collapsed, setCollapsed] = useState(true)
    const [afterCollapsed, setAfterCollapsed] = useState(true)

    const onTextLayout = useCallback(
      ({
          nativeEvent: {
              layout: { height },
          },
      }) => {
          setTextHeight(height)
      },
      [setTextHeight],
    )

    const onHiddenTextLayout = useCallback(
      ({
          nativeEvent: {
              layout: { height },
          },
      }) => {
          setHiddenTextHeight(height)
          setMountHiddenTextOne(false)
      },
      [setHiddenTextHeight, setMountHiddenTextOne],
    )

    const onHiddenSeeLessTextLayoutTwo = useCallback(
      ({
          nativeEvent: {
              layout: { height },
          },
      }) => {
          setHiddenTextHeightWithSeeLess(height)
          setMountHiddenTextTwo(false)
      },
      [setHiddenTextHeightWithSeeLess, setMountHiddenTextTwo],
    )

    const toggle = useCallback(() => {
        setCollapsed((prev) => !prev)
    }, [setCollapsed])

    useEffect(() => {
        if (!hiddenTextHeight || !textHeight) {
            return
        }

        setSeeMore(hiddenTextHeight > textHeight)
    }, [textHeight, hiddenTextHeight])

    useEffect(() => {
        if (collapsed === afterCollapsed) {
            return
        }

        const callback = collapsed ? onCollapse : onExpand
        setAfterCollapsed(collapsed)
        if (animate) {
            LayoutAnimation.configureNext(readmoreAnimation, callback)
        } else {
            callback()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapsed])

    useEffect(() => {
        setMountHiddenTextOne(true)
        setMountHiddenTextTwo(true)
    }, [
        numberOfLines,
        style,
        wrapperStyle,
        children,
        seeMoreStyle,
        seeMoreText,
        seeLessStyle,
        seeLessText,
        ellipsis,
        allowFontScaling,
    ])

    const textProps = afterCollapsed ? {
          onLayout: onTextLayout,
          numberOfLines,
          ellipsizeMode: 'tail',
      } : {}

    const additionalProps = {}
    if (allowFontScaling !== undefined) {
        additionalProps.allowFontScaling = allowFontScaling
    }

    return (
      <View style={wrapperStyle}>
          {/* text component to measure see if see more is applicable and get height */}
          {mountHiddenTextOne && (
            <TextComponent
              {...additionalProps}
              style={StyleSheet.flatten([
                  Array.isArray(style) ? StyleSheet.flatten(style) : style,
                  styles.hiddenTextAbsolute,
              ])}
              ellipsizeMode={'clip'}
              onLayout={onHiddenTextLayout}>
                {children || ''}
            </TextComponent>
          )}
          {/* text component to measure height with see less */}
          {mountHiddenTextTwo && (
            <TextComponent
              {...additionalProps}
              style={StyleSheet.flatten([
                  Array.isArray(style) ? StyleSheet.flatten(style) : style,
                  styles.hiddenTextAbsolute,
              ])}
              onLayout={onHiddenSeeLessTextLayoutTwo}>
                {children || ''}
                {` ${seeLessText}`}
            </TextComponent>
          )}
          <TextComponent
            {...additionalProps}
            {...restProps}
            style={style}
            {...textProps}>
              {children || ''}
              {seeMore && !collapsed && !expandOnly && (
                <TextComponent
                  {...additionalProps}
                  {...restProps}
                  onPress={toggle}
                  style={seeLessStyle}>
                    {hiddenTextHeightWithSeeLess > hiddenTextHeight ? '\n' : ' '}
                    {seeLessText}
                </TextComponent>
              )}
          </TextComponent>
          {seeMore && collapsed && afterCollapsed && (
            <View style={[styles.seeMoreContainer, { backgroundColor }]}>
                <TextComponent
                  {...additionalProps}
                  {...restProps}
                  onPress={toggle}
                  style={[style, seeMoreStyle]}>
                    {`${ellipsis} ${seeMoreText}`}
                </TextComponent>
            </View>
          )}
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    hiddenTextAbsolute: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        color: 'transparent',
    },
    seeMoreContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    seeMoreButton: {
        flexDirection: 'row',
    },
    defaultText: {},
    seeMoreText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_10,
        lineHeight: Typography.LINE_HEIGHT_10,
        color: Colors.SECONDARY,
    },
    seeLessText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_10,
        lineHeight: Typography.LINE_HEIGHT_10,
        color: Colors.SECONDARY,
    },
})

ReadMore.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    seeMoreStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    seeLessStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    children: PropTypes.any,
    numberOfLines: PropTypes.number,
    seeMoreText: PropTypes.string,
    seeLessText: PropTypes.string,
    animate: PropTypes.bool,
    backgroundColor: PropTypes.string,
    customTextComponent: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.element,
        PropTypes.elementType,
    ]),
    ellipsis: PropTypes.string,
    allowFontScaling: PropTypes.bool,
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func,
    expandOnly: PropTypes.bool,
}

ReadMore.defaultProps = {
    style: styles.defaultText,
    seeMoreStyle: StyleSheet.flatten([styles.defaultText, styles.seeMoreText]),
    seeLessStyle: StyleSheet.flatten([styles.defaultText, styles.seeLessText]),
    wrapperStyle: styles.container,
    text: '',
    numberOfLines: 3,
    seeMoreText: 'See more',
    seeLessText: 'See less',
    animate: true,
    backgroundColor: 'white',
    customTextComponent: Text,
    ellipsis: '...',
    onExpand: () => {},
    onCollapse: () => {},
    expandOnly: false,
}

export default memo(ReadMore)
