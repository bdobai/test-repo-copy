import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Alert, StatusBar, TouchableHighlight } from "react-native";
import { Colors, Spacing, Typography } from '_styles'
import Container from '_components/atoms/Container'
import { scaleSize } from '_styles/mixins'
import { AuthStoreContext } from '_stores'
import {Linking} from 'react-native'
import SectionTitle from '_atoms/SectionTitle';
import Button from "_atoms/Button";
import { request } from "_utils/request";
import { isIphone } from "_utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseurl } from "_base/config/settings";
import Spinner from "_atoms/Spinner";
import { visilabsApi } from "_utils/analytics";


const AccountSettingsScreen = (props) => {
    const [loadingPassbook, setLoadingPassbook] = useState(false);
    const authStore = React.useContext(AuthStoreContext);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            visilabsApi.customEvent('Account-Settings');
            StatusBar.setBarStyle('light-content')
            if(!isIphone()){
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor('transparent');
            }
        });

        return unsubscribe;
    }, [props.navigation]);

    const logout = () => {
        request('/user/logout.json', {
            method: 'POST',
            data: {},
            withToken: true,
            withoutJson: true,
            success: function () {
                authStore.logout()
            },
            error: (e) => {
                authStore.logout()
            }
        });
    }

    const onLogout = () => {
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
                  onPress: () => logout()
              },
          ],
        );
    }

    const email = 'support_cc@cc.com';
    const sendEmail = () => {
        Linking.openURL('mailto:'+{email})
    }

    const onFAQ = () => {
        props.navigation.navigate('AccountNavigator', {
            screen: 'AccountSettings.FAQ'
        })
    }

    const onTerms = () => {
        props.navigation.navigate('AccountNavigator', {
            screen: 'AccountSettings.Terms', params: {
                code: 'terms', title: 'Terms and Conditions'
            }
        })
    }

    const onPrivacy = () => {
        props.navigation.navigate('AccountNavigator', {
            screen: 'AccountSettings.PrivacyPolicy', params: {
                code: 'privacy', title: 'Privacy Policy'
            }
        })
    }

    const onDownloadPassbook = async () => {
        const sessionKey = await AsyncStorage.getItem('session_key')
        setLoadingPassbook(true);
        if (isIphone()) {
            Linking.openURL(`${baseurl}/vendor/107430/passbook/card/export/${authStore.user.id}?session_key=${sessionKey}`)
                .then(()=>{
                    setLoadingPassbook(false);
                return;
            })
                .catch(()=> setLoadingPassbook(false))
        }
        request(`/vendor/107430/googlepaypass/1/export/${authStore.user.id}`, {
            method: 'GET',
            withToken: true,
            data:{},
            success: function (res) {
                Linking.openURL(res.google_pay_pass_url).then(()=>{
                    setLoadingPassbook(false);
                    return;
                })
                    .catch(()=> setLoadingPassbook(false))
            },
            error: (e) => {
                console.log('e',e);
            }
        })
    }

    const renderPassbookText = () => {
        // Add QR to Apple/Google Wallet
        if(isIphone()){
            return 'Add QR to Apple Wallet'
        }
        return 'Add QR to Google Pay'
    }

    return <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={'light-content'}/>
        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <Container style={ styles.container }>
                <SectionTitle>YOUR PROFILE</SectionTitle>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={() => props.navigation.navigate('AccountNavigator', {screen:'AccountSettings.Info'})} style={styles.listItem}>
                    <Text style={styles.listItemText}>Personal Information</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={() => props.navigation.navigate('History')} style={styles.listItem}>
                    <Text style={styles.listItemText}>Order History</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={() => props.navigation.navigate('AccountNavigator', {screen:'AccountSettings.GiftCards'})} style={styles.listItem}>
                    <Text style={styles.listItemText}>Add or Manage Gift Cards</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={() => props.navigation.navigate('AccountNavigator', {screen:'AccountSettings.CreditCards'})} style={styles.listItem}>
                    <Text style={styles.listItemText}>Manage Payment Methods</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={onDownloadPassbook}>
                    <View style={[styles.listItem, styles.passbookWrapper]}>
                        <Text style={styles.listItemText}>{renderPassbookText()}</Text>
                        {loadingPassbook && <Spinner size={'small'} color={Colors.BLUE_GRAY}/>}
                    </View>
                </TouchableHighlight>

                <SectionTitle>SUPPORT</SectionTitle>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={() => sendEmail()} style={styles.listItem}>
                    <Text style={styles.listItemText}>Contact Us</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={onFAQ} style={styles.listItem}>
                    <Text style={styles.listItemText}>FAQ</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={onTerms} style={styles.listItem}>
                    <Text style={styles.listItemText}>Terms of Service</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#DDDDDD" onPress={onPrivacy} style={styles.listItem}>
                    <Text style={styles.listItemText}>Privacy Policy</Text>
                </TouchableHighlight>
                <View style={styles.footer}>
                    <Button textStyle={styles.buttonTitle} bodyStyle={styles.button} onPress={onLogout} block={true} type={'primary'} text={'LOGOUT'}/>
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
    passbookWrapper: {
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})

export default AccountSettingsScreen
