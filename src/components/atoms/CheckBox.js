import React from 'react'
import { StyleSheet, Text, Pressable, View, Linking } from 'react-native'
import { Colors, Typography } from '../../styles'
import { scaleSize } from '_styles/mixins'
import { Spacing } from '_styles'
import CheckIcon from '_assets/images/check.svg';

const CheckBox = (props) => {
    return (
      <Pressable style={styles.container}  onPress={() => props.onPress(props.item)}>
          <View style={styles.labelWrapper}>
              <View style={[styles.checkBoxInput, [props.style]]}>
                  {props.checked ? <CheckIcon height={scaleSize(12)} width={scaleSize(12)} fill={Colors.WHITE}/> : null}
              </View>
              <View style={{ flex: 1 }}>
                {props.label ? <Text style={styles.checkBoxLabel}>{props.label}</Text> : null}
                {props.urlLink && props.urlText ? <Text style={styles.checkBoxLink} onPress={() => Linking.openURL(props.urlLink)}>{props.urlText}</Text> : null}
              </View>
              {props.children ? props.children : null}              
          </View>
      </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    checkBoxInput: {
        width: scaleSize(25),
        height: scaleSize(25),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.PRIMARY_LIGHT,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkBoxLabel: {
        flex: 1,
        paddingLeft: Spacing.SPACING_2,
        color: Colors.WHITE,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
    },
    checkBoxLink: {
        flex: 1,
        paddingLeft: Spacing.SPACING_2,
        color: Colors.SECONDARY,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_14,
    },
    labelWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default CheckBox
