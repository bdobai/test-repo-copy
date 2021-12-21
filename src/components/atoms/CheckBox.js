import React from 'react'
import { StyleSheet, Text, Pressable, View, Linking } from 'react-native'
import { Colors, Typography } from '../../styles'
import { scaleSize } from '_styles/mixins'
import { Spacing } from '_styles'

const CheckBox = (props) => {
    return (
      <Pressable style={styles.container}  onPress={() => props.onPress(props.item)}>
          <View style={styles.labelWrapper}>
              <View style={[styles[`${props.type}CheckBoxInput`], props.error ? styles.checkboxInputError : null, [props.style]]}>
                  {props.checked ? <View style={styles[`${props.type}Check`]}/> : null}
              </View>
              {props.children ? props.children :
                <View style={{ flex: 1 }}>
                    {props.label ? <Text style={[styles.checkBoxLabel, props.labelStyle]}>{props.label}</Text> : null}
                    {props.urlLink && props.urlText ? <Text style={styles.checkBoxLink} onPress={() => Linking.openURL(props.urlLink)}>{props.urlText}</Text> : null}
                </View>
              }
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
    squareCheckBoxInput: {
        width: scaleSize(28),
        height: scaleSize(28),
        marginRight: Spacing.SPACING_5,
        borderWidth: 1,
        borderColor: Colors.PRIMARY_LIGHT,
        alignItems: 'center',
        justifyContent: 'center'
    },
    roundCheckBoxInput: {
        width: scaleSize(28),
        height: scaleSize(28),
        borderRadius: scaleSize(14),
        marginRight: Spacing.SPACING_5,
        borderWidth: 1,
        borderColor: Colors.PRIMARY_LIGHT,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkboxInputError: {
        borderColor: Colors.DANGER,
    },
    checkBoxLabel: {
        flex: 1,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    checkBoxLink: {
        flex: 1,
        color: Colors.SECONDARY,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    labelWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    squareCheck: {
        width: scaleSize(18),
        height: scaleSize(18),
        backgroundColor: Colors.BLACK
    },
    roundCheck: {
        width: scaleSize(18),
        height: scaleSize(18),
        borderRadius: scaleSize(9),
        backgroundColor: Colors.BLACK
    },
})

export default CheckBox
