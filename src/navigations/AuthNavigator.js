import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from '_scenes/auth/LoginScreen'
import RegisterScreen from '_scenes/auth/RegisterScreen'
import RegisterScreen_2 from '_scenes/auth/RegisterScreen_2'
import VerificationScreen from '_scenes/auth/VerificationScreen'
import { StyleSheet } from 'react-native'
import RecoverScreen from '_scenes/auth/RecoverScreen'
import ResetScreen from '_scenes/auth/ResetScreen'
import { Colors, Typography } from "_styles";
import LandingScreen from "_scenes/auth/LandingScreen";
import BackButton from "_atoms/BackButton";
import { scaleSize } from "_styles/mixins";
import TermsScreen from "_scenes/account/TermsScreen";
import PrivacyPolicyScreen from "_scenes/account/PrivacyPolicyScreen";
import AccountValidationScreen from "_scenes/auth/AccountValidationScreen";
import { navigationStyles } from "_styles/navigation";
import ConfirmSmsScreen from "_scenes/auth/ConfirmSmsScreen";

const Stack = createStackNavigator()

function AuthNavigator (props) {

    const authOptions = {
        cardStyle: navigationStyles.cardStyle,
        headerShown: true,
        headerStyle: navigationStyles.whiteHeader,
        headerTitle: '',
        headerLeft:() => <BackButton color={Colors.PRIMARY}/>,
    }

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen options={{cardStyle: navigationStyles.cardStyle}} name="Landing" component={LandingScreen}/>
            <Stack.Screen name="Login" component={LoginScreen} options={authOptions}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={authOptions}/>
            <Stack.Screen name="Register_2" component={RegisterScreen_2} options={authOptions}/>
            <Stack.Screen name="Register_3" component={ConfirmSmsScreen} initialParams={{email:'eu'}} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'Account Validation',
                headerTitleStyle: navigationStyles.headerTitle,
                headerStyle: navigationStyles.primaryHeader,
            }}/>
            <Stack.Screen name="Recover" component={RecoverScreen} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'Forgot Password',
                headerTitleStyle: navigationStyles.headerTitle,
                headerStyle: navigationStyles.primaryHeader

            }}/>
            <Stack.Screen name="Terms" component={TermsScreen} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'TERMS OF SERVICE',
                headerTitleStyle: navigationStyles.headerTitle,
                headerStyle: navigationStyles.primaryHeader

            }}/>
            <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'PRIVACY POLICY',
                headerTitleStyle: navigationStyles.headerTitle,
                headerStyle: navigationStyles.primaryHeader

            }}/>
            <Stack.Screen options={{cardStyle: navigationStyles.cardStyle}} name="Reset" component={ResetScreen}/>
            <Stack.Screen options={{cardStyle: navigationStyles.cardStyle}} name="Verification" component={VerificationScreen}/>
        </Stack.Navigator>
    )
}

export default AuthNavigator
