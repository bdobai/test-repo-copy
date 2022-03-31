import { Dimensions, PixelRatio } from 'react-native'

export const WINDOW_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height
export const WINDOW_HEIGHT = Dimensions.get('window').height
export const SCREEN_WIDTH = Dimensions.get('screen').width
const guidelineBaseWidth = 414

export const scaleSize = size => (WINDOW_WIDTH / guidelineBaseWidth) * size
export const scaleVerticalSize = size => (WINDOW_HEIGHT / 1170) * size

export const scaleFont = size => Math.ceil(size * (WINDOW_WIDTH / guidelineBaseWidth))
// export const scaleFont = size => size * PixelRatio.getFontScale()

export function boxShadow (color, offset = { height: 2, width: 2 },
  radius = 8, opacity = 0.2) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    }
}
