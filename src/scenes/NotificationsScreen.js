import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from '_components/molecules/Header'
import Avatar from '_atoms/Avatar'
import ItemsGrid from '_organisms/ItemsGrid'
import NotificationCardLoader from '_components/loaders/NotificationCardLoader'
import { AuthStoreContext } from '_stores'
// import SearchButton from '_atoms/SearchButton'
import NotificationIcon from '_atoms/NotificationIcon'
import { Colors, Spacing, Typography } from '_styles'
import { scaleSize } from '_styles/mixins'
import NotificationCard from '_molecules/NotificationCard'

const NotificationsScreen = (props) => {
    const {user} = React.useContext(AuthStoreContext);

    return <View style={{flex: 1}}>
        <Header
          left={<Avatar image={user.image}/>}
          right={ <View style={styles.headerActions}>
              <View style={[styles.headerAction, styles.active]}><NotificationIcon active={true}/></View>
              {/*<View style={styles.headerAction}><SearchButton onPress={() => props.navigation.navigate('Search')}/></View>*/}
          </View>}
        />
        <ItemsGrid
          paddingTop={true}
          url={'/notifications'}
          columns={1}
          noDataText={"You don't have notifications"}
          noDataComponent={() => <View style={styles.noDataWrapper}>
              <Text style={styles.noDataText}>You don't have any notifications at the moment. Make a donation, buy a ticket, or add your favorite organizations to receive notifications.</Text>
          </View>}
          _renderLoader={(notification, index) => <NotificationCardLoader style={{width: '100%'}} key={index}/>}
          _renderItem={(notification) => <NotificationCard notification={notification}/>}
        />
    </View>
}

const styles = StyleSheet.create({
    headerActions: {
        flexDirection: 'row',
    },
    headerAction: {
        alignItems: 'center',
        justifyContent: 'center',
        height: scaleSize(48),
        width: scaleSize(48)
    },
    active: {
        backgroundColor: Colors.WHITE + '40',
        borderRadius: scaleSize(24)
    },
    noDataWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.SPACING_6,
        paddingHorizontal: scaleSize(20)
    },
    noDataText: {
        textAlign: 'center',
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        marginTop: Spacing.SPACING_5,
        marginBottom: Spacing.SPACING_5
    },
})

export default NotificationsScreen
