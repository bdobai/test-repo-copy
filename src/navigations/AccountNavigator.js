import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AccountSettingsScreen from '_scenes/AccountSettingsScreen'
import AccountInfoScreen from '_scenes/account/AccountInfoScreen'
import ChangePasswordScreen from '_scenes/account/ChangePasswordScreen'
import MyPaymentsScreen from '_scenes/account/MyPaymentsScreen'
import GiftCardBalanceScreen from '_scenes/account/GiftCardBalanceScreen'
import GiftCardAddScreen from '_scenes/account/GiftCardAddScreen'
import GiftScreen from '_scenes/account/GiftScreen'
import ContactScreen from '_scenes/account/ContactScreen'
import PrivacyPolicyScreen from '_scenes/account/PrivacyPolicyScreen'
import TermsScreen from '_scenes/account/TermsScreen'
import FaqScreen from '_scenes/account/FaqScreen'


import AddCreditCardScreen from '_scenes/account/AddCreditCardScreen'
import PageScreen from '_scenes/account/PageScreen'
import { StyleSheet } from 'react-native'
import { Colors, Spacing, Typography } from "_styles";
import Logo from '_assets/images/logo_small_white.svg';
import { scaleSize } from '_styles/mixins';
import LeftChevron from '_assets/images/left-chevron.svg';

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.PRIMARY
    }
})

function AccountNavigator () {
    return (
      <Stack.Navigator initialRouteName="AccountSettings" screenOptions={{
          headerMode: 'float',
          headerBackImage: () => <LeftChevron fill={'#ffffff'} height={scaleSize(18)} width={scaleSize(52)}/>,
          headerBackTitleVisible: false,
          headerTitleStyle:{
              color: Colors.WHITE,
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_PRIMARY_REGULAR,
              fontWeight:'600',
          },
          headerStyle: {
              backgroundColor: Colors.PRIMARY,
              borderBottomWidth: 0,
              shadowOpacity: 0,
              height: scaleSize(112),
          },
          headerBackTitleStyle: {
              paddingLeft: 20
          },
          cardStyle: styles.cardStyle
      }}>
          <Stack.Screen name="AccountSettings.Info" component={AccountInfoScreen} options={{title: 'How Can We Help?'}}/>
          <Stack.Screen name="AccountSettings.MyPayments" component={MyPaymentsScreen}/>
          <Stack.Screen name="AccountSettings.GiftCards" component={GiftCardBalanceScreen}/>
          <Stack.Screen name="AccountSettings.GiftCardAdd" component={GiftCardAddScreen}/>
          <Stack.Screen name="AccountSettings.Gift" component={GiftScreen}/>
          <Stack.Screen name="AccountSettings.Contact" component={ContactScreen}/>
          <Stack.Screen name="AccountSettings.Terms" component={TermsScreen} options={{title: 'TERMS OF SERVICE'}}/>
          <Stack.Screen name="AccountSettings.PrivacyPolicy" component={PrivacyPolicyScreen} options={{title: 'PRIVACY POLICY'}}/>
          <Stack.Screen name="AccountSettings.Faq" component={FaqScreen}/>

          <Stack.Screen name="AccountSettings.AddCreditCard" component={AddCreditCardScreen}/>
          <Stack.Screen name="AccountSettings.ChangePassword" component={ChangePasswordScreen}/>

          <Stack.Screen name="AccountSettings.Page" component={PageScreen}/>

      </Stack.Navigator>
    )
}

export default AccountNavigator
