import React, { useState } from 'react'
import { StyleSheet, TextInput, Pressable, View, Animated, Dimensions, TouchableOpacity } from 'react-native'
import { Colors, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'
import SearchIcon from '_assets/images/search.svg'
import CloseIcon from '_assets/images/close.svg'

const SearchButton = props => {
    const searchRef = React.useRef()

    const [term, setTerm] = useState('')
    const [events, setEvents] = useState(false)
    const [opacityValue] = useState(new Animated.Value(0))
    const [widthValue] = useState(new Animated.Value(0))

    const expand = () => {
        Animated.timing(opacityValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
        }).start();
        Animated.spring(widthValue, {
            toValue: Dimensions.get('window').width - scaleSize(145),
            duration: 200,
            delay: 100,
            bounciness: 0,
            useNativeDriver: false
        }).start();
        setEvents(true)
        searchRef.current.focus()
    }

    const hide = () => {
        Animated.timing(opacityValue, {
            toValue: 0,
            duration: 200,
            delay: 100,
            useNativeDriver: true
        }).start();
        Animated.spring(widthValue, {
            toValue: 0,
            duration: 400,
            bounciness: 0,
            useNativeDriver: false
        }).start();
        setEvents(false)
        setTerm('')
        if (props.onChange) {
            props.onChange('')
        }
    }

    const onChange = (value) => {
        setTerm(value)
        if (props.onChange) {
            props.onChange(value)
        }
    }

    return <View style={styles.wrapper}>
        <Animated.View pointerEvents={!events ? 'none' : 'auto'} style={[styles.searchInput, {opacity: opacityValue}]}>
            <View style={styles.iconWrapper}>
                <SearchIcon width={scaleSize(25)} height={scaleSize(25)} fill={Colors.WHITE}/>
            </View>
            <Animated.View style={{
                width: widthValue,
            }}>
                <TextInput
                  ref={searchRef}
                  placeholder={'Type here to search'}
                  placeholderTextColor={Colors.WHITE}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  allowFontScaling={false}
                  onChangeText={(value) => onChange(value)}
                  value={term}
                  style={styles.searchInputField}/>
            </Animated.View>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => hide()}><CloseIcon width={scaleSize(15)} height={scaleSize(15)} fill={Colors.WHITE}/></TouchableOpacity>
        </Animated.View>
        <Pressable  style={styles.iconWrapper} onPress={() => props.onPress ? props.onPress() : expand()}>
            <SearchIcon fill={Colors.WHITE} width={scaleSize(25)} height={scaleSize(25)}/>
        </Pressable>
    </View>
}


const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        zIndex: 1
    },
    placeholderWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#3D4C4E33',
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7FC7E5',
        borderRadius: scaleSize(24),
        height: scaleSize(48),
        marginBottom: Spacing.SPACING_3,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 3
    },
    searchInputField: {
        flex: 1,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        color: Colors.WHITE
    },
    iconWrapper: {
        width: scaleSize(48),
        height: scaleSize(48),
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default SearchButton
