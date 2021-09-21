import React, {useState} from 'react'
import { StyleSheet, View, Text, Pressable, Alert, PanResponder, Animated } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '_styles/index.js'
import Card from '_atoms/Card'
import { scaleSize } from '_styles/mixins'
// import { useNavigation } from '@react-navigation/native'
import { dateFormat } from '_utils/helpers'
import TrashIcon from '_assets/images/trash.svg'
// import EditIcon from '_assets/images/edit.svg'
import { RADIUS_1 } from '_styles/radius'
import { request } from '_utils/request'
import Spinner from '_atoms/Spinner'
import Radio from '_atoms/Radio'

const SWIPE_ACTIVE_THRESHOLD = scaleSize(65);

const CreditCardCard = (props) => {
    // const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false)

    const [translateX] = useState(new Animated.Value(0));
    const [offset, setOffset] = useState(0);
    const [height] = useState(new Animated.Value(scaleSize(65) + Spacing.SPACING_2));
    const [opacity] = useState(new Animated.Value(1));


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const { dx, dy } = gestureState
            return dx > 8 || dx < -8 || dy > 8 || dy < -8
        },
        onPanResponderMove: (event, gesture) => {
            translateX.setValue(offset + gesture.dx)
        },
        onPanResponderRelease: (event, gesture) => {
            finishAnimation()
        },
        onPanResponderTerminate: (evt, gestureState) => {
            finishAnimation()
        },
    })

    const finishAnimation = () => {
        if (translateX._value < -SWIPE_ACTIVE_THRESHOLD/2) {
            Animated.timing(translateX, {
                toValue: -SWIPE_ACTIVE_THRESHOLD,
                duration: 200,
                useNativeDriver: true
            }).start()
            setOffset(-SWIPE_ACTIVE_THRESHOLD)
        } else {
            Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start()
            setOffset(0)
        }
    }

    // const animatedWrapperStyle = useAnimatedStyle(() => {
    //     return {
    //         height: withTiming(height.value, {
    //             duration: 500,
    //             easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    //         }),
    //         opacity: withTiming(opacity.value, {
    //             duration: 200,
    //             easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    //         }),
    //         backgroundColor: Colors.WHITE
    //     };
    // });

    const remove = () => {
        Animated.timing(height, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
        }).start()
        Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const deleteCreditCard = () => {
        if (loading) {
            return null
        }
        Alert.alert('Delete credit card', '', [
            {
                text: 'Yes',
                onPress: () => {
                    setLoading(true)
                    request('/payments/credit-cards/delete', {
                        data: { id: props.creditCard.id },
                        method: 'POST',
                        success: function (res) {
                            setLoading(false)
                            remove()
                        },
                        error: function (error) {
                            setLoading(false)
                        },
                    })
                }
            },
            {
                text: 'Cancel',
                style: 'cancel'
            },
        ])
    }

    const animatedStyleWrapper =  {
        height: height,
        opacity: opacity,
    };

    const animatedStyle =  {
        transform: [
            {
                translateX: translateX.interpolate({
                    inputRange: [-SWIPE_ACTIVE_THRESHOLD, 0],
                    outputRange: [-SWIPE_ACTIVE_THRESHOLD, 0],
                    extrapolate: 'clamp'
                }),
            },
        ],
        zIndex: 1,
    };

    return (
      <Animated.View style={animatedStyleWrapper}>
          <View style={{paddingBottom: Spacing.SPACING_2}}>
              <Animated.View {...panResponder.panHandlers} style={animatedStyle}>
                  <Card style={[styles.container, props.style]}>
                      <Pressable disabled={!props.selectable} android_ripple={{color: Colors.SECONDARY + 40}} onPress={() => props.onSelect ? props.onSelect(props.creditCard) : null} style={({ pressed }) => [styles.body, pressed ? styles.bodyPressed : null]}>
                          {props.selectable ? (
                              <View style={styles.radioWrapper}>
                                  <View style={[styles.radioInput, props.creditCard === props.selectedValue ? styles.radioInputChecked : null]}/>
                              </View>
                          ) : null}
                          <View style={{flex: 1, paddingRight: Spacing.SPACING_2}}>
                              <Text style={styles.hashText}>XXXX-XXXX-XXXX-{props.creditCard.hash}</Text>
                              <Text style={styles.nameText}>{props.creditCard.name}</Text>
                          </View>
                          <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
                              <Text style={styles.dateText}>{dateFormat(props.creditCard.expire_date, 'MM/YY')}</Text>
                          </View>
                      </Pressable>
                  </Card>
              </Animated.View>
              <View style={styles.actionButtonsWrapper}>
                  {/*<Pressable onPress={() => navigation.navigate('AccountSettings.DonationDetails', {donation: props.donation})} style={[styles.actionButton]}>*/}
                  {/*    <EditIcon width={scaleSize(18)} height={scaleSize(18)} fill={Colors.WHITE}/>*/}
                  {/*    <Text style={styles.actionButtonText}>Edit</Text>*/}
                  {/*</Pressable>*/}
                  <Pressable onPress={deleteCreditCard} style={[styles.actionButton2]}>
                      <Spinner overlay={true} visible={loading}/>
                      <TrashIcon width={scaleSize(18)} height={scaleSize(18)} fill={Colors.WHITE}/>
                      <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
              </View>
          </View>
      </Animated.View>
    );
}

CreditCardCard.propTypes = {
    creditCard: PropTypes.object,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
}

CreditCardCard.defaultTypes = {
    selectable: false,
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        height: scaleSize(65),
    },
    radioWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: scaleSize(10),
        paddingRight: scaleSize(15)
    },
    body: {
        padding: Spacing.SPACING_3,
        paddingRight: Spacing.SPACING_5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    bodyPressed: {
        backgroundColor: Colors.CARD_PRESSED
    },
    hashText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        marginBottom: Spacing.SPACING_1
    },
    dateText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.MUTED,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    nameText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.MUTED,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    actionButtonsWrapper: {
        position: 'absolute',
        right: 0,
        top: 0,
        flexDirection: 'row',
        zIndex: 0,
    },
    actionButton: {
        height: scaleSize(65),
        width: scaleSize(65),
        backgroundColor: Colors.SECONDARY,
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionButton2: {
        height: scaleSize(65),
        width: scaleSize(65),
        backgroundColor: Colors.DELETE,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: RADIUS_1,
        borderBottomRightRadius: RADIUS_1
    },
    actionButtonText: {
        marginTop: Spacing.SPACING_1,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_10,
        lineHeight: Typography.LINE_HEIGHT_10,
    },
    radioInput: {
        width: scaleSize(20),
        height: scaleSize(20),
        borderRadius: scaleSize(10),
        borderWidth: scaleSize(5),
        borderColor: Colors.GRAY_MEDIUM,
        backgroundColor: Colors.GRAY_MEDIUM,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioInputChecked: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.WHITE,
    },
})

export default CreditCardCard
