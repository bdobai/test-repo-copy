import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Colors, Typography } from '../../styles'
import { scaleSize } from '_styles/mixins'
import { useNavigation } from '@react-navigation/native';
import { AuthStoreContext } from '_stores'
import { observer } from 'mobx-react-lite'

const NotificationIcon = observer((props) => {
    const navigation = useNavigation();
    const { notificationsCount } = React.useContext(AuthStoreContext)

    return (
      <Pressable onPress={() => props.active ? navigation.navigate('Home.Dashboard') : navigation.navigate('Notifications')} style={styles.container}>
          {notificationsCount > 0 ? (
              <View style={styles.bubble}>
                  <Text style={styles.bubbleText}>{notificationsCount}</Text>
              </View>)
            : null}
      </Pressable>
    )
})

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubble: {
        position: 'absolute',
        backgroundColor: '#FF6A6A',
        top: scaleSize(10),
        left: scaleSize(8),
        borderRadius: scaleSize(8),
        width: scaleSize(16),
        height: scaleSize(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubbleText: {
        color: Colors.WHITE,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontSize: Typography.FONT_SIZE_10,
        lineHeight: Typography.LINE_HEIGHT_10,
    }
})

export default NotificationIcon
