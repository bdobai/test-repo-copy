import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

type ShimmerProps = {
    height?: number,
    width?: number,
    percentage?: boolean,
    style?: any,
    children?: any,
};
const Shimmer = (props: ShimmerProps) => {
    const { height, width, style, children } = props
    return (
      <ShimmerPlaceholder
        style={style}
        autoRun={true}
        width={width}
        height={height}
        duration={2000}
        opacity
        shimmerColors={['#56D4FC50', '#56D4FC20', '#56D4FC50']}
        // shimmerColors={[
        //     'rgb(86,212,252, 0.5)',
        //     'rgba(86,212,252,0.2)',
        //     'rgba(86,212,252,0.5)',
        // ]}
        >
          {children}
      </ShimmerPlaceholder>
    )
}

export default Shimmer
