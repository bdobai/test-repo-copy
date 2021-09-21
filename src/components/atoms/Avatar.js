import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import PropTypes from 'prop-types'
import { scaleSize } from '_styles/mixins'
import { getImage } from '_utils/image'
import { observer } from 'mobx-react-lite'
import UserIcon from '_assets/images/user.svg'

const Avatar = observer(props => {
    return (
      <View style={[styles.container, props.style]}>
          {props.image ? <Image style={styles.image} source={{ uri: getImage(props.image, 50, 50, false) }}/> : <UserIcon fill={'#ffffff'}/>}
      </View>
    )
})

Avatar.propTypes = {
    image: PropTypes.any
}

const styles = StyleSheet.create({
    container: {
        width: scaleSize(54),
        height: scaleSize(54),
        backgroundColor: '#7CD2F1',
        borderRadius: scaleSize(25),
        borderWidth: 2,
        borderColor: "#7CD2F1",
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: scaleSize(50),
        height: scaleSize(50),
        borderRadius: scaleSize(25),
    }
})

export default Avatar
