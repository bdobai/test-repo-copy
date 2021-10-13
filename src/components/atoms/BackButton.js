import React from 'react'
import { Pressable } from 'react-native'
import LeftChevron from '_assets/images/left-chevron.svg'
import { useNavigation } from '@react-navigation/native';
import { scaleSize } from '_styles/mixins'

const BackButton = props => {
    const navigation = useNavigation();

    const onPress = () => {
        if (props.onPress) {
            return props.onPress()
        }
        if (props.route) {
            return navigation.navigate(props.route)
        }

        navigation.goBack()
    }

    return <Pressable style={{width: scaleSize(20), height: scaleSize(20), alignItems: 'flex-start', justifyContent: 'center'}}  onPress={() => onPress()}>
        <LeftChevron fill= {props.color ? props.color : '#ffffff'} height={18} width={20}/>
    </Pressable>
}

export default BackButton
