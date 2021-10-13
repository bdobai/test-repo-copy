import React, { useState } from 'react'
import { Animated, SafeAreaView, StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { scaleSize } from '_styles/mixins'
import { Colors, Spacing, Typography } from '_styles'
import Logo from '_assets/images/logo.svg'
import Img1 from '_assets/images/onboarding/1.svg'
import Img1_1 from '_assets/images/onboarding/1_1.svg'
import Img2 from '_assets/images/onboarding/2.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { HEADER_SPACE } from '_styles/spacing'
import Button from '_components/atoms/Button';
import Container from '_components/atoms/Container';

const OnboardingScreen = (props) => {
    const [screen, setScreen] = useState(0);
    const [opacities] = useState([
        new Animated.Value(1),
        new Animated.Value(0),
    ]);
    // const [dotOpacities] = useState([
    //     new Animated.Value(1),
    //     new Animated.Value(0.2),
    // ]);
    // const [skipOpacity] = useState(new Animated.Value(1));
    // const [btnRight] = useState(new Animated.Value(0));

    // function showNextOnboarding() {
    //     if (screen === opacities.length -1) {
    //         return skipOnboarding()
    //     }
    //     if(screen === opacities.length - 2) {
    //         Animated.timing(skipOpacity, {
    //             toValue: 0,
    //             duration: 300,
    //             useNativeDriver: true
    //         }).start();
    //         Animated.timing(btnRight, {
    //             toValue: Dimensions.get('window').width/2 - scaleSize(250)/2,
    //             duration: 300,
    //             useNativeDriver: false
    //         }).start();
    //     }else{
    //         Animated.timing(skipOpacity, {
    //             toValue: 1,
    //             duration: 300,
    //             useNativeDriver: true
    //         }).start();
    //         Animated.timing(btnRight, {
    //             toValue: 0,
    //             duration: 300,
    //             useNativeDriver: false
    //         }).start();
    //     }

    //     Animated.timing(opacities[screen], {
    //         toValue: 0,
    //         duration: 500,
    //         useNativeDriver: true
    //     }).start()
    //     Animated.timing(opacities[screen + 1], {
    //         toValue: 1,
    //         duration: 500,
    //         useNativeDriver: true
    //     }).start()
    //     Animated.timing(dotOpacities[screen], {
    //         toValue: 0.2,
    //         duration: 500,
    //         useNativeDriver: true
    //     }).start()
    //     Animated.timing(dotOpacities[screen + 1], {
    //         toValue: 1,
    //         duration: 500,
    //         useNativeDriver: true
    //     }).start()

    //     setScreen(screen + 1);
    // }

    function skipOnboarding() {
        AsyncStorage.setItem('Onboarding', '1')
        props.navigation.navigate('Login')
    }

    return <View style={styles.background}>
        <SafeAreaView style={{flex: 1, marginTop: HEADER_SPACE}}>
            <View style={styles.logoWrapper}>
                <Animated.View>
                    <Logo style={ styles.logo }/>
                </Animated.View>
            </View>
            <View style={styles.contentWrapper}>
                <View style={styles.imageWrapper}>
                    {/* <Animated.View style={[styles.img, {opacity: opacities[0]}]}>
                        <Img1 style={styles.img_img}/>
                        <Img1_1 style={styles.img_bg}/>
                        <Text style={styles.img_text}>01</Text>
                    </Animated.View> */}
                    <Animated.View style={[styles.img, {opacity: opacities[0]}]}>
                        <Img2 style={styles.img_img}/>
                        <Img1_1 style={ styles.img_bg }/>
                    </Animated.View>
                </View>
                <Container style={ styles.welcomeTextContainer}>
                    {/* <Animated.View style={[styles.welcomeTextWrapper, {opacity: opacities[0]}]}>
                        <Text style={ styles.welcomeText }>Meet our new <Text style={ styles.welcomeTextGold }>Season</Text> coffee</Text>
                    </Animated.View> */}
                    <Animated.View style={[styles.welcomeTextWrapper, {opacity: opacities[0]}]}>
                        <Text style={ styles.welcomeText }>Enjoy a time with <Text style={ styles.welcomeTextGold }>Costa Coffee</Text></Text>
                    </Animated.View>
                </Container>
            </View>
            <Container style={styles.buttonsWrapper}>
                {/* { screen === 0 &&
                    <Pressable style={styles.skipTextTouchable} onPress={() => skipOnboarding()}>
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>
                }
                { screen === 0 &&
                    <View style={styles.dotsWrapper}>
                        <Animated.View style={[styles.dot]}/>
                        <Animated.View style={[styles.dotNext]}/>
                    </View>
                }
                { screen === 0 &&
                   <Pressable style={styles.nextTextTouchable} onPress={() => showNextOnboarding()}>
                         <Text numberOfLines={1} style={styles.nextText}>Next</Text>
                    </Pressable>
                } */}
                { screen === 0 &&
                    // <View style={styles.footer}>
                    //     <Button onPress={() => props.navigation.navigate('Login')} block={true} type={'secondary'} text={'Log in'}/>
                    //     <View style={styles.footerTextView}>
                    //         <Text style={styles.footerText}>Don't have an account? </Text>
                    //         <Pressable onPress={() => props.navigation.navigate('Register')}><Text style={styles.footerActionText}>Sign up</Text></Pressable>
                    //     </View>
                    // </View>
                    <Button type="outlineSecondary" block={true} text="Let's get started" onPress={() => skipOnboarding()}/>
                }
            </Container>
        </SafeAreaView>
    </View>
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    // footer: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'flex-end',
    //     marginBottom: Spacing.SPACING_4,
    // },
    // footerActionText: {
    //     fontFamily: Typography.FONT_PRIMARY_BOLD,
    //     fontSize: Typography.FONT_SIZE_12,
    //     lineHeight: Typography.LINE_HEIGHT_14,
    //     color: Colors.SECONDARY
    // },
    // footerTextView: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginTop: Spacing.SPACING_4
    // },
    // footerText: {
    //     color: Colors.WHITE,
    //     fontFamily: Typography.FONT_PRIMARY_REGULAR,
    //     fontSize: Typography.FONT_SIZE_12,
    //     lineHeight: Typography.LINE_HEIGHT_14
    // },
    logo: {
        marginTop: scaleSize(50)
    },
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(100),
        paddingLeft: Spacing.SPACING_5,
        paddingRight: Spacing.SPACING_5,
    },

    dotsWrapper: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1
    },
    dot: {
        height: scaleSize(5),
        width: scaleSize(32),
        borderRadius: scaleSize(6),
        backgroundColor: Colors.SECONDARY,
        margin: scaleSize(2.5)
    },
    dotNext: {
        height: scaleSize(5),
        width: scaleSize(5),
        borderRadius: scaleSize(6),
        backgroundColor: Colors.WHITE,
        margin: scaleSize(2.5)
    },

    contentWrapper: {
        flex: 1,
        top: scaleSize(30),
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageWrapper: {
        width: '100%',
        alignItems: 'flex-end',
        height: scaleSize(490)
    },
    img: {
        position: 'absolute',
        bottom: scaleSize(10)
    },
    img_img: {
        height: scaleSize(400),
        top: scaleSize(30)
    },
    img_bg: {
        position: 'absolute',
        zIndex: -1,
        right: 0
    },
    // img_text: {
    //     position: 'absolute',
    //     color: '#F4F3EF',
    //     right: scaleSize(24),
    //     top: scaleSize(20),
    //     fontFamily: Typography.FONT_SECONDARY_BOLD,
    //     fontSize: Typography.FONT_SIZE_46,
    //     lineHeight: Typography.LINE_HEIGHT_48,
    //     opacity: 0.2
    // },

    welcomeTextContainer: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
    },
    welcomeTextWrapper: {
        position: 'absolute',
        top:  scaleSize(-30),
        left: scaleSize(25)
    },
    welcomeText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontSize: Typography.FONT_SIZE_46,
        lineHeight: Typography.LINE_HEIGHT_46,
    },
    welcomeTextGold: {
        color: Colors.SECONDARY
    },

    buttonsWrapper: {
        marginBottom:  scaleSize(20),
        height: scaleSize(50),
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center'
    },
    skipTextTouchable: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: scaleSize(60),
        height: scaleSize(50),
    },
    skipText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_14,
    },
    nextTextTouchable: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: scaleSize(60),
        height: scaleSize(50),
    },
    nextText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.SECONDARY,
        fontSize: Typography.FONT_SIZE_14,
        lineHeight: Typography.LINE_HEIGHT_14,
    },
})

export default OnboardingScreen
