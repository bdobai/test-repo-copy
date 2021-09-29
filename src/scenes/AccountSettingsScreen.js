import React from 'react'
import { SafeAreaView, StyleSheet, Text, Pressable, View, ScrollView, Alert, Platform } from 'react-native'
import Header from '_components/molecules/Header'
import Card from '_components/atoms/Card'
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import ChevronIcon from '_assets/images/right-chevron.svg'
import LogoutIcon from '_assets/images/account/logout.svg'
import { scaleSize } from '_styles/mixins'
import { AuthStoreContext } from '_stores'
import Logo from '_assets/images/logo_2.svg'
import BackButton from '_atoms/BackButton'
import {Linking} from 'react-native'

const AccountSettingsScreen = (props) => {
    const authStore = React.useContext(AuthStoreContext);

    const logout = () => {
        Alert.alert(
          'Logout',
          'Are you sure?',
          [
              {
                  text: 'Cancel',
                  style: 'cancel'
              },
              {
                  text: 'Yes',
                  onPress: () => authStore.logout()
              },
          ],
        );
    }

    const email = 'support_cc@cc.com';
    const sendEmail = () => {
        Linking.openURL('mailto:'+{email})
    }

    return <View style={ styles.settingsScreen }>
        <Header
          left={<BackButton/>}
          center={<Logo style={ styles.logo }/>}
        />
        <Text style={styles.title}>MY PROFILE</Text>
        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Container style={ styles.container }>
                    <Card noPadding={true} style={styles.card}>
                        <Pressable delayPressIn={100} onPress={() => props.navigation.navigate('AccountSettings.Info')} style={({pressed}) => pressed ? styles.listItemPressed : styles.listItem}>
                            <>
                                <Text style={styles.listItemText}>Personal Information</Text>
                                <View style={styles.iconWrapper}><ChevronIcon fill={Colors.SECONDARY} height={18}/></View>
                            </>
                        </Pressable>
                        {Platform.OS !== 'ios' ? <Pressable delayPressIn={100} onPress={() => props.navigation.navigate('AccountSettings.MyPayments')} style={({pressed}) => pressed ? styles.listItemPressed : styles.listItem}>
                            <>
                                <Text style={styles.listItemText}>Payments</Text>
                                <View style={styles.iconWrapper}><ChevronIcon fill={Colors.SECONDARY} height={18}/></View>
                            </>
                        </Pressable> : null}
                        <Pressable delayPressIn={100} onPress={() => props.navigation.navigate('AccountSettings.MyDonations')} style={({pressed}) => pressed ? styles.listItemPressed : styles.listItem}>
                            <>
                                <Text style={styles.listItemText}>Gift cards</Text>
                                <View style={styles.iconWrapper}><ChevronIcon fill={Colors.SECONDARY} height={18}/></View>
                            </>
                        </Pressable>
                        <Pressable onPress={() => sendEmail()} style={({pressed}) => pressed ? styles.listItemPressed : styles.listItem}>
                            <>
                                <Text style={styles.listItemText}>Support</Text>
                                <View style={styles.iconWrapper}><ChevronIcon fill={Colors.SECONDARY} height={18}/></View>
                            </>
                        </Pressable>
                        <Pressable delayPressIn={100} onPress={() => props.navigation.navigate('AccountSettings.Contact', {code: 'privacy', title: 'Privacy Policy'})} style={({pressed}) => pressed ? styles.listItemPressed : styles.listItem}>
                            <>
                                <Text style={styles.listItemText}>Contact Us</Text>
                                <View style={styles.iconWrapper}><ChevronIcon fill={Colors.SECONDARY} height={18}/></View>
                            </>
                        </Pressable>
                        <Pressable delayPressIn={100} onPress={() => props.navigation.navigate('AccountSettings.Terms', {code: 'terms', title: 'Terms and Conditions'})} style={({pressed}) => pressed ? styles.listItemPressed : styles.listItem}>
                            <>
                                <Text style={styles.listItemText}>Terms of Service</Text>
                                <View style={styles.iconWrapper}><ChevronIcon fill={Colors.SECONDARY} height={18}/></View>
                            </>
                        </Pressable>
                        <Pressable delayPressIn={100} onPress={() => props.navigation.navigate('AccountSettings.PrivacyPolicy', {code: 'privacy', title: 'Privacy Policy'})} style={({pressed}) => pressed ? styles.listItemPressed : styles.listItem}>
                            <>
                                <Text style={styles.listItemText}>Privacy Policy</Text>
                                <View style={styles.iconWrapper}><ChevronIcon fill={Colors.SECONDARY} height={18}/></View>
                            </>
                        </Pressable>
                    </Card>
                </Container>
            </SafeAreaView>
        </ScrollView>
        <View style={styles.footer}>
            <Pressable onPress={() => logout()}><LogoutIcon width={scaleSize(26)} height={scaleSize(26)} fill={Colors.WHITE}/></Pressable> 
            <Text style={styles.footerText}>Log out</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.PRIMARY,     
    },
    container: {
        flex: 1,
        paddingBottom: Spacing.SPACING_5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: Spacing.SPACING_5
    },
    footerText: {
        marginLeft: Spacing.SPACING_5,
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_18,
        color: Colors.WHITE
    },
    listItem: {
        flexDirection: 'row',
        paddingVertical: Spacing.SPACING_5,
        marginLeft: Spacing.SPACING_2,
        borderBottomWidth: 1,
        borderBottomColor: Colors.PRIMARY_LIGHT
    },
    listItemPressed: {
        flexDirection: 'row',
        paddingVertical: Spacing.SPACING_5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.SECONDARY,
        backgroundColor: Colors.PRIMARY_LIGHT
    },
    listItemText: {
        flex: 1,
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_18,
        color: Colors.WHITE
    },
    logo: {
        marginLeft: -18 //fix because center on header does not take into consideration the back button space
    },
    settingsScreen: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
    },
    title: {
        color: Colors.SECONDARY_LIGHT,
        fontSize: Typography.FONT_SIZE_13,
        lineHeight: Typography.LINE_HEIGHT_13,
        paddingLeft: Spacing.SPACING_5,
        marginTop: Spacing.SPACING_3
    },
})

export default AccountSettingsScreen
