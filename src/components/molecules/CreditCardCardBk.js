import React from 'react'
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '_styles/index.js'
import Card from '_atoms/Card'
import { scaleSize } from '_styles/mixins'
import { useNavigation } from '@react-navigation/native'
import { dateFormat } from '_utils/helpers'
import TrashIcon from '_assets/images/trash.svg'
import EditIcon from '_assets/images/edit.svg'

import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    withSpring,
    withTiming,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    Easing
} from "react-native-reanimated";
import { clamp, snapPoint } from "react-native-redash";
import { RADIUS_1 } from '_styles/radius'
import { request } from '_utils/request'
import Spinner from '_atoms/Spinner'

const SWIPE_ACTIVE_THRESHOLD = scaleSize(130);

export const SPRING_CONFIG = {
    damping: 40,
    mass: 1,
    stiffness: 500,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
};

const CreditCardCard = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false)

    const translateX = useSharedValue(0);
    const height = useSharedValue(scaleSize(65));
    const opacity = useSharedValue(scaleSize(65));

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.x = translateX.value;
        },
        onActive: (event, ctx) => {
            translateX.value = ctx.x + event.translationX;
        },
        onEnd: ({translationX, velocityX}) => {
            const snapPointX = snapPoint(translationX, velocityX, [0, -SWIPE_ACTIVE_THRESHOLD]);
            translateX.value = withSpring(snapPointX, SPRING_CONFIG);
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: clamp(translateX.value, -SWIPE_ACTIVE_THRESHOLD, 0),

                },
            ],
            zIndex: 1
        };
    });

    const animatedWrapperStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(height.value, {
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            opacity: withTiming(opacity.value, {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            backgroundColor: Colors.WHITE
        };
    });

    const remove = () => {
        height.value = 0
        opacity.value = 0
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

    return (
      <Animated.View style={animatedWrapperStyle}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={animatedStyle}>
                  <Pressable  onPress={() => props.onPress ? props.onPress() : null}>
                      <Card style={[styles.container, props.style]}>
                          <View style={styles.body}>
                              <View style={{flex: 1, paddingRight: Spacing.SPACING_2}}>
                                  <Text style={styles.hashText}>XXXX-XXXX-XXXX-{props.creditCard.hash}</Text>
                              </View>
                              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                                  <Text style={styles.nameText}>{props.creditCard.name}</Text>
                                  <Text style={styles.dateText}>{dateFormat(props.creditCard.expire_date, 'MM/YY')}</Text>
                              </View>
                          </View>
                      </Card>
                  </Pressable>
              </Animated.View>
          </PanGestureHandler>
          <View style={styles.actionButtonsWrapper}>
              <Pressable onPress={() => navigation.navigate('AccountSettings.DonationDetails', {donation: props.donation})} style={[styles.actionButton]}>
                  <EditIcon width={scaleSize(18)} height={scaleSize(18)} fill={Colors.WHITE}/>
                  <Text style={styles.actionButtonText}>Edit</Text>
              </Pressable>
              <Pressable onPress={deleteCreditCard} style={[styles.actionButton2]}>
                  <Spinner overlay={true} visible={loading}/>
                  <TrashIcon width={scaleSize(18)} height={scaleSize(18)} fill={Colors.WHITE}/>
                  <Text style={styles.actionButtonText}>Delete</Text>
              </Pressable>
          </View>
      </Animated.View>
    );
}

CreditCardCard.propTypes = {
    creditCard: PropTypes.object,
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        height: scaleSize(65),
    },
    body: {
        padding: Spacing.SPACING_3,
        paddingRight: Spacing.SPACING_5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
    },
    hashText: {
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
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
    }
})

export default CreditCardCard
