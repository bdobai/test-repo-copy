import React from 'react'
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import { HTMLStyles } from '_utils/html_styles'
import HTML from 'react-native-render-html'

const HTMLView = props => {
    if (!props.html) {
        return null;
    }
    return <HTML source={{ html: props.html }}
        imagesMaxWidth={Dimensions.get('window').width}
        onPress={(evt, href) => this.handleUrl(href)}
        classesStyles={HTMLStyles.classesStyles}
        baseFontStyle={HTMLStyles.baseFontStyle}
        ignoredStyles={HTMLStyles.ignoredStyles}
        tagsStyles={HTMLStyles.tagsStyles}
    />
}

HTMLView.propTypes = {
    html: PropTypes.any,
}

HTMLView.defaultProps = {
    html: null,
}

export default HTMLView
