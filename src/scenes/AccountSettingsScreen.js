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
// import Logo from '_assets/images/logo_small_white.svg'
// import BackButton from '_atoms/BackButton'
import {Linking} from 'react-native'
import SectionTitle from '_atoms/SectionTitle';
import Button from "_atoms/Button";

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

    return <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <Container style={ styles.container }>
                    <SectionTitle>YOUR PROFILE</SectionTitle>
                    <Pressable onPress={() => props.navigation.navigate('AccountNavigator', {screen:'AccountSettings.Info'})} style={styles.listItem}>
                        <Text style={styles.listItemText}>Personal Information</Text>
                    </Pressable>
                    <Pressable onPress={() => props.navigation.navigate('History')} style={styles.listItem}>
                        <Text style={styles.listItemText}>Order History</Text>
                    </Pressable>
                    <Pressable onPress={() => props.navigation.navigate('AccountSettings.GiftCards')} style={styles.listItem}>
                        <Text style={styles.listItemText}>Add or Manage Gift Cards</Text>
                    </Pressable>
                <Pressable onPress={() => props.navigation.navigate('AccountSettings.GiftCards')} style={styles.listItem}>
                        <Text style={styles.listItemText}>Manage Payment Methods</Text>
                    </Pressable>

                    <SectionTitle>SUPPORT</SectionTitle>
                    <Pressable onPress={() => sendEmail()} style={styles.listItem}>
                        <Text style={styles.listItemText}>Contact Us</Text>
                    </Pressable>
                    <Pressable onPress={() => props.navigation.navigate('AccountNavigator', {screen: 'AccountSettings.Terms', params: {code: 'terms', title: 'Terms and Conditions'}})} style={styles.listItem}>
                        <Text style={styles.listItemText}>Terms of Service</Text>
                    </Pressable>
                    <Pressable onPress={() => props.navigation.navigate('AccountNavigator', {screen: 'AccountSettings.PrivacyPolicy', params: {code: 'privacy', title: 'Privacy Policy'}})} style={styles.listItem}>
                        <Text style={styles.listItemText}>Privacy Policy</Text>
                    </Pressable>
                <View style={styles.footer}>
                    <Button textStyle={styles.buttonTitle} bodyStyle={styles.button} onPress={logout} block={true} type={'primary'} text={'LOGOUT'}/>
                </View>
            </Container>
        </ScrollView>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.WHITE,
    },
    button: {
        width:'70%',
        alignSelf:'center',
        height: scaleSize(55),
        borderRadius: scaleSize(30),
        marginTop: Spacing.SPACING_5
    },
    buttonTitle: {
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_20,
        fontWeight: '500',
        fontFamily: Typography.FONT_SECONDARY_REGULAR
    },
    container: {
        flex: 1,
        paddingTop: Spacing.SPACING_6,
        paddingBottom: Spacing.SPACING_5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: Spacing.SPACING_5
    },
    footerText: {
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        marginLeft: Spacing.SPACING_5,
        fontSize: Typography.FONT_SIZE_18,
        lineHeight: Typography.LINE_HEIGHT_18,
        color: Colors.PRIMARY
    },
    listItem: {
        flexDirection: 'row',
        paddingVertical: Spacing.SPACING_3,
        borderBottomWidth: 1,
        borderBottomColor: Colors.LIGHT_GREY
    },
    listItemText: {
        flex: 1,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        lineHeight: Typography.LINE_HEIGHT_16,
        color: Colors.BLACK
    },
})

export default AccountSettingsScreen
