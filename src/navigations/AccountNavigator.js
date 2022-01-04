import * as React from 'react'
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import AccountInfoScreen from '_scenes/account/AccountInfoScreen'
import NewPasswordScreen from '_scenes/account/NewPasswordScreen'
import MyPaymentsScreen from '_scenes/account/MyPaymentsScreen'
import GiftCardBalanceScreen from '_scenes/account/GiftCardBalanceScreen'
import GiftCardScreen from '_scenes/account/GiftCardScreen'
import GiftScreen from '_scenes/account/GiftScreen'
import ContactScreen from '_scenes/account/ContactScreen'
import PrivacyPolicyScreen from '_scenes/account/PrivacyPolicyScreen'
import TermsScreen from '_scenes/account/TermsScreen'
import FaqScreen from '_scenes/account/FaqScreen'
import AddCreditCardScreen from '_scenes/account/AddCreditCardScreen'
import PageScreen from '_scenes/account/PageScreen'
import { scaleSize } from '_styles/mixins';
import LeftChevron from '_assets/images/left-chevron.svg';
import { navigationStyles } from "_styles/navigation";
import OldPasswordScreen from "_scenes/account/OldPasswordScreen";

const Stack = createStackNavigator()

function AccountNavigator () {
    return (
      <Stack.Navigator initialRouteName="AccountSettings"  screenOptions={{
          headerMode: 'float',
          headerBackImage: () => <LeftChevron fill={'#ffffff'} height={scaleSize(18)} width={scaleSize(52)}/>,
          headerBackTitleVisible: false,
          headerTitleStyle: navigationStyles.accountHeader,
          headerStyle: navigationStyles.primaryHeader,
          headerBackTitleStyle: navigationStyles.headerBackTitleStyle,
          cardStyle: navigationStyles.cardStyle,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitleAlign: 'center',
      }}>
          <Stack.Screen name="AccountSettings.Info" component={AccountInfoScreen} options={{title: 'How Can We Help?'}}/>
          <Stack.Screen name="AccountSettings.MyPayments" component={MyPaymentsScreen}/>
          <Stack.Screen name="AccountSettings.GiftCards" component={GiftCardScreen} options={{title:'Manage Cards'}}/>
          <Stack.Screen name="AccountSettings.GiftCardAdd" component={GiftCardScreen}/>
          <Stack.Screen name="AccountSettings.Gift" component={GiftScreen}/>
          <Stack.Screen name="AccountSettings.Contact" component={ContactScreen}/>
          <Stack.Screen name="AccountSettings.Terms" component={TermsScreen} options={{title: 'TERMS OF SERVICE'}}/>
          <Stack.Screen name="AccountSettings.PrivacyPolicy" component={PrivacyPolicyScreen} options={{title: 'PRIVACY POLICY'}}/>
          <Stack.Screen name="AccountSettings.Faq" component={FaqScreen}/>

          <Stack.Screen name="AccountSettings.AddCreditCard" component={AddCreditCardScreen} options={{title: 'New Credit Card'}}/>
          <Stack.Screen name="AccountSettings.NewPassword" component={NewPasswordScreen} options={{title:'Personal Information'}}/>
          <Stack.Screen name="AccountSettings.OldPassword" component={OldPasswordScreen} options={{title:'CURRENT PASSWORD'}}/>

          <Stack.Screen name="AccountSettings.Page" component={PageScreen}/>

      </Stack.Navigator>
    )
}

export default AccountNavigator
