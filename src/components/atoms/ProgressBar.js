import React from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import PropTypes from 'prop-types'
import { scaleSize } from '_styles/mixins'
import { Colors } from '_styles'

function ProgressBar(props) {
    const [width, setWidth] = React.useState(props.percent ?? 0)
    React.useEffect( () => {
       setWidth(props.percent)
    }, [props])

    // const [widthValue] = React.useState(new Animated.Value(0))
    // const width = widthValue.interpolate({
    //     inputRange: [0, 100],
    //     outputRange: ["0%", "100%"],
    //     extrapolate: "clamp"
    // })
    // React.useEffect( () => {
    //     if (props.percent != widthValue.__getValue()) {
    //         Animated.spring(widthValue, {
    //             toValue: props.percent.clampPercentBar(),
    //             duration: 600,
    //             useNativeDriver: false
    //         }).start();
    //     }
    // }, [props])
    //
    // React.useEffect( () => {
    //     if (props.percent != widthValue.__getValue()) {
    //         Animated.spring(widthValue, {
    //             toValue: props.percent.clampPercentBar(),
    //             duration: 600,
    //             useNativeDriver: false
    //         }).start();
    //     }
    // }, [])

    return (
      <View style={[styles.background, {backgroundColor: props.color + '25'}, props.size === 'large' ? styles.backgroundLarge : null]}>
          <Animated.View style={[
              styles.bar,
              { backgroundColor: props.color, width: width + '%' },
              props.size === 'large' ? styles.barLarge : null,
          ]}/>
      </View>
    )
}

ProgressBar.propTypes = {
    percent: PropTypes.number,
    color: PropTypes.string,
    size: PropTypes.string,
}

ProgressBar.defaultProps = {
    percent: 1,
    color: Colors.PRIMARY,
    size: 'small',
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: scaleSize(8),
        borderRadius: scaleSize(4),
        padding: scaleSize(2)
    },
    bar: {
        height: scaleSize(4),
        borderRadius: scaleSize(2),
    },
    backgroundLarge: {
        height: scaleSize(16),
        borderRadius: scaleSize(8),
        padding: scaleSize(3)
    },
    barLarge: {
        height: scaleSize(10),
        borderRadius: scaleSize(5),
    }
})

export default React.memo(ProgressBar)
