import React from 'react'
import { Pressable } from 'react-native'
import LeftChevron from '_assets/images/left-chevron.svg'
import { useNavigation } from '@react-navigation/native';
import { scaleSize } from '_styles/mixins'
import { Spacing } from "_styles";

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

    return <Pressable style={{width: scaleSize(26), height: scaleSize(26), justifyContent: 'center', marginLeft: Spacing.SPACING_1}}  onPress={() => onPress()}>
        <LeftChevron fill={props.color ? props.color : '#ffffff'} height={24} width={24}/>
    </Pressable>
}

export default BackButton
