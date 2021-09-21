import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import Theme from '../themes/Theme'

const FormGroup = (props) => {
    return (
      <View style={[styles.section, props.style]}>
          <View style={styles.containerStyle}>
              {props.label !== undefined ? <View>
                  <Text style={[styles.labelStyle, props.styleLabel]}>{props.label}</Text>
              </View> : null}
              <View style={[styles.inputStyle, props.inputStyle]}>
                  {props.children ? props.children : null}
              </View>
              {(props.text ? <Text style={styles.formGroupText}>{props.text}</Text> : null)}
          </View>
      </View>
    )
}

FormGroup.propTypes = {
    style: PropTypes.any,
    styleLabel: PropTypes.any,
    label: PropTypes.string,
    text: PropTypes.string,
    error: PropTypes.string,
    notes: PropTypes.string,
}

const styles = StyleSheet.create({
    notes: {
        marginTop: 2,
        color: '#4A4A4A',
        fontSize: 12,
        minHeight: 16,
        fontFamily: 'Montserrat-Light',
    },
    inputStyle: {
        flexDirection: 'row',
        flex: 1
    },
    section: {
        paddingBottom: Theme.padding * 2,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative'
    },
    labelStyle: {
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
        flex: 1,
        lineHeight: 18,
        marginBottom: 6,
        color: Theme.Colors.textLabel,
    },
    containerStyle: {
        minHeight: 36,
        flex: 1
    },
    formGroupText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: Theme.Colors.dark,
        lineHeight: 16,
    }
})

export default FormGroup
