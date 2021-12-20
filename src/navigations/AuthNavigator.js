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

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.PRIMARY
    },
    whiteHeader: {
        borderWidth:0,
        elevation:0,
        shadowColor: Colors.WHITE,
        height: scaleSize(112),
    },
    primaryHeader: {
        backgroundColor:Colors.PRIMARY,
        borderColor: Colors.PRIMARY,
        shadowColor: Colors.PRIMARY,
        height: scaleSize(112),
    },
    headerTitle: {
        textTransform:'uppercase',
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_PRIMARY_REGULAR,
        fontWeight:'600',
    }
})

function AuthNavigator (props) {
    const authOptions = {
        cardStyle: styles.cardStyle,
        headerShown: true,
        headerStyle: styles.whiteHeader,
        headerTitle: '',
        headerLeft:() => <BackButton color={Colors.PRIMARY}/>,
    }

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Landing" component={LandingScreen}/>
            <Stack.Screen name="Login" component={LoginScreen} options={authOptions}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={authOptions}/>
            <Stack.Screen name="Register_2" component={RegisterScreen_2} options={authOptions}/>
            <Stack.Screen name="Register_3" component={AccountValidationScreen} initialParams={{email:'eu'}} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'Account Validation',
                headerTitleStyle: styles.headerTitle,
                headerStyle: styles.primaryHeader,
            }}/>
            <Stack.Screen name="Recover" component={RecoverScreen} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'Forgot Password',
                headerTitleStyle: styles.headerTitle,
                headerStyle: styles.primaryHeader

            }}/>
            <Stack.Screen name="Terms" component={TermsScreen} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'TERMS OF SERVICE',
                headerTitleStyle: styles.headerTitle,
                headerStyle: styles.primaryHeader

            }}/>
            <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{
                ...authOptions,
                headerLeft: () => <BackButton colors={Colors.WHITE}/>,
                headerTitle: 'PRIVACY POLICY',
                headerTitleStyle: styles.headerTitle,
                headerStyle: styles.primaryHeader

            }}/>
            <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Reset" component={ResetScreen}/>
            <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Verification" component={VerificationScreen}/>
        </Stack.Navigator>
    )
}

export default AuthNavigator
