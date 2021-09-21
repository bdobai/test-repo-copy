import React, { Component } from 'react'
import { Dimensions, SafeAreaView } from 'react-native'
import { NotificationsStoreContext } from '_stores'
import Notification from '_molecules/Notification'
import { observer } from 'mobx-react-lite'
import { scaleSize } from '_styles/mixins'

const NotificationsSystem = observer((props) => {
    const notificationsStore = React.useContext(NotificationsStoreContext);

    const onRemove = (notification) => {
        notificationsStore.removeNotification(notification);
    }

    return <SafeAreaView style={styles.container}>
        {notificationsStore.notifications.map((notification, index) => (
          <Notification
            first={index === 0}
            key={notification.id}
            title={notification.title}
            notification={notification}
            description={notification.description}
            onPress={notification.onPress}
            type={notification.type} mobx
            timing={notification.timing}
            onRemove={onRemove}
          />
        ))}
    </SafeAreaView>

})

const styles = {
    container: {
        position: 'absolute',
        top: scaleSize(30),
        left: 0,
        width: Dimensions.get('window').width,
        zIndex: 100,
    },
}
export default NotificationsSystem
