import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AccountSettingsScreen from '_scenes/AccountSettingsScreen'
import AccountInfoScreen from '_scenes/account/AccountInfoScreen'
import ChangePasswordScreen from '_scenes/account/ChangePasswordScreen'
import MyPaymentsScreen from '_scenes/account/MyPaymentsScreen'
import SupportScreen from '_scenes/account/SupportScreen'
import ContactScreen from '_scenes/account/ContactScreen'
import ContactConfirmationScreen from '_scenes/account/ContactConfirmationScreen'
import PrivacyPolicyScreen from '_scenes/account/PrivacyPolicyScreen'
import TermsScreen from '_scenes/account/TermsScreen'


import AddCreditCardScreen from '_scenes/account/AddCreditCardScreen'
import PageScreen from '_scenes/account/PageScreen'
import { StyleSheet } from 'react-native'
import { Colors } from '_styles'

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.GRAY_MEDIUM
    }
})

const forFade = ({ current }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

function AccountNavigator () {
    return (
      <Stack.Navigator initialRouteName="AccountSettings" headerMode={'none'} screenOptions={{
          headerShown: false,
          cardStyleInterpolator: forFade,
      }}>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings" component={AccountSettingsScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.Info" component={AccountInfoScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.MyPayments" component={MyPaymentsScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.Support" component={SupportScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.Contact" component={ContactScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.Confirmation" component={ContactConfirmationScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.PrivacyPolicy" component={PrivacyPolicyScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.Terms" component={TermsScreen}/>

          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.AddCreditCard" component={AddCreditCardScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.ChangePassword" component={ChangePasswordScreen}/>

          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.Page" component={PageScreen}/>
        {/* <Stack.Screen options={{cardStyle: styles.cardStyle}} name="AccountSettings.GiftCards" component={GiftCardsScreen}/> */}
      </Stack.Navigator>
    )
}

export default AccountNavigator
