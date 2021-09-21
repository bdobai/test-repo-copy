import React, { useState, useEffect } from 'react'
import { Animated, Dimensions, Keyboard, SafeAreaView, StyleSheet, TouchableHighlight, View } from 'react-native'
import { scaleSize } from '_styles/mixins'
import { Colors } from '_styles'

const TabBar = ({ state, descriptors, navigation }) => {
    const totalWidth = Dimensions.get('window').width
    const tabWidth = totalWidth / state.routes.length
    const [translateValue] = useState(new Animated.Value(tabWidth * 2))

    const animateBar = () => {
        Animated.spring(translateValue, {
            toValue: state.index * tabWidth,
            velocity: 10,
            useNativeDriver: true,
        }).start()
    }

    useEffect(() => {
        animateBar()
    }, [state])

    return (
      <SafeAreaView style={styles.safeView}>
          <View style={styles.bar}>
              <Animated.View
                style={[
                    styles.slider,
                    {
                        transform: [{ translateX: translateValue }],
                        width: tabWidth - 20,
                    },
                ]}
              />
              {state.routes.map((route, index) => {
                  const { options } = descriptors[route.key]
                  const icon = options.tabBarIcon !== undefined ? options.tabBarIcon : null
                  const isFocused = state.index === index

                  const onPress = () => {
                      animateBar()

                      const event = navigation.emit({
                          type: 'tabPress',
                          target: route.key,
                      })

                      Keyboard.dismiss();

                      if (!isFocused && !event.defaultPrevented) {
                          navigation.navigate(route.name)
                      }else{
                          navigation.reset({
                              index: 0,
                              routes: [{ name: route.name }],
                          })
                          // navigation.navigate(route.name, { screen: null})

                          // naavigation.dispatch(StackActions.popToTop());
                      }
                  }

                  const onLongPress = () => {
                      navigation.emit({
                          type: 'tabLongPress',
                          target: route.key,
                      })
                  }

                  return (
                    <TouchableHighlight
                      underlayColor="#DDDDDD20"
                      key={index}
                      accessibilityRole="button"
                      accessibilityStates={isFocused ? ['selected'] : []}
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      testID={options.tabBarTestID}
                      onPress={onPress}
                      onLongPress={onLongPress}
                      style={styles.tabIcon}
                    >
                        {icon({ focused: isFocused })}
                    </TouchableHighlight>
                  )
              })}
          </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeView: {
        backgroundColor: 'white',
    },
    bar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: scaleSize(80),
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: scaleSize(15),
    },
    tabIcon: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 50,
    },
    slider: {
        height: 3,
        width: scaleSize(50),
        position: 'absolute',
        bottom: 10,
        left: 10,
        borderRadius: 10,
    },
})

export default TabBar
