import React from 'react'
import { StyleSheet, View, Text, Image, Pressable } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Spacing, Typography } from '../../styles/index.js'
import Card from '_atoms/Card'
import { scaleSize } from '_styles/mixins'
import { beautify, dateFormat } from '_utils/helpers'
import DonationIcon from '_assets/images/notifications/donation.svg'
import TicketIcon from '_assets/images/account/ticket.svg'
import BellIcon from '_assets/images/bell.svg'
import { getImage } from '_utils/image'
import { useNavigation } from '@react-navigation/native'

const NotificationCard = (props) => {
    const navigation = useNavigation();

    const getNotificationImage = () => {
        if (props.notification.image) {
            return <Image style={styles.image} source={{uri: getImage(props.notification.image, 50, 50, false)}}/>
        }

        switch (props.notification.type) {
            case 'BUY_TICKETS': {
                return <TicketIcon fill={'#D0DCE3'} height={scaleSize(25)} width={scaleSize(25)}/>
            }
            case 'NEW_DONATION': {
                return <DonationIcon fill={'#D0DCE3'} height={scaleSize(50)}/>
            }
            case 'NEW_EVENT': case 'NEW_ORGANIZATION': case 'NEW_FUNDRAISER': {
                return <BellIcon fill={'#D0DCE3'} height={scaleSize(50)}/>
            }
        }
        return null;
    }

    const goToNotification = () => {
        if(!props.notification.navigation){
            return null;
        }
        switch (props.notification.navigation.screen) {
            case 'TICKETS': {
                return navigation.navigate('AccountSettings', {screen: 'AccountSettings.MyTickets'});
            }
            case 'TICKET': {
                return navigation.navigate('AccountSettings', {screen: 'AccountSettings.TicketDetails', params: {event_id: props.notification.navigation.id}});
            }
            case 'DONATIONS': {
                return navigation.navigate('AccountSettings', {screen: 'AccountSettings.MyDonationsList'});
            }
            case 'DONATION': {
                return navigation.navigate('AccountSettings', {screen: 'AccountSettings.DonationDetails', params: {event_id: props.notification.navigation.id}});
            }
            case 'EVENT': {
                return navigation.navigate('Modal', {screen: 'Event', params: {event_id: props.notification.navigation.id}});
            }
            case 'ORGANIZATION': {
                return navigation.navigate('Modal', {screen: 'Organization', params: {organization_id: props.notification.navigation.id}});
            }
            case 'FUNDRAISER': {
                return navigation.navigate('Modal', {screen: 'Fundraiser', params: {fundraiser_id: props.notification.navigation.id}});
            }
        }
        return null;
    }

    if (!props.notification) {
        return null
    }

    return <Pressable onPress={() => goToNotification()}>
        <Card style={[styles.container, props.style]}>
            {props.notification.read === false ? <View style={styles.readNotification}/> : null}
            <View style={styles.avatarWrapper}>
                {getNotificationImage()}
            </View>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.typeText}>{beautify(props.notification.type)}</Text>
                    <Text style={styles.typeText}>{dateFormat(props.notification.date, 'MMMM D') }</Text>
                </View>
                <Text style={styles.textText}>{props.notification.text}</Text>
            </View>
        </Card>
    </Pressable>
}

NotificationCard.propTypes = {
    notification: PropTypes.object,
}

const styles = StyleSheet.create({
    container: {
        height: scaleSize(85),
        padding: Spacing.SPACING_3,
        paddingRight: Spacing.SPACING_6,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible'
    },
    avatarWrapper: {
        width: scaleSize(50),
        height: scaleSize(50),
        borderRadius: scaleSize(25),
        backgroundColor: Colors.GRAY_MEDIUM,
        marginRight: Spacing.SPACING_3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: scaleSize(25),
    },
    typeText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.MUTED,
        fontSize: Typography.FONT_SIZE_10,
        lineHeight: Typography.LINE_HEIGHT_10,
    },
    textText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        color: Colors.GRAY_DARK,
        fontSize: Typography.FONT_SIZE_12,
        lineHeight: Typography.LINE_HEIGHT_12,
        marginTop: Spacing.SPACING_1
    },
    readNotification: {
        position: 'absolute',
        left: scaleSize(-8),
        width: scaleSize(16),
        height: scaleSize(16),
        borderRadius: scaleSize(8),
        backgroundColor: '#ff6a6a'
    }
})

export default NotificationCard
