import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from '_scenes/auth/LoginScreen'
import RegisterScreen from '_scenes/auth/RegisterScreen'
import RegisterScreen_2 from '_scenes/auth/RegisterScreen_2'
import RegisterScreen_3 from '_scenes/auth/RegisterScreen_3'
import VerificationScreen from '_scenes/auth/VerificationScreen'
import { StyleSheet } from 'react-native'
import RecoverScreen from '_scenes/auth/RecoverScreen'
import ResetScreen from '_scenes/auth/ResetScreen'
import OnboardingScreen from '_scenes/OnboardingScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors } from '_styles'

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.PRIMARY
    }
})

function AuthNavigator (props) {
    const [onboarding, setOnboarding] = useState(null)

    const getOnboarding = async () => {
        try {
            const seenOnboarding = await AsyncStorage.getItem('Onboarding')
            // setOnboarding(false)
            setOnboarding(seenOnboarding === '1')
            if(seenOnboarding === '1'){
                props.navigation.navigate('Login')
            }
        } catch (e) {

        }
    }

    useEffect(() => {
        getOnboarding()
    }, [])

    if (onboarding === null) {
        return <></>
    }

    return (
      <Stack.Navigator headerMode={'none'}>
          {!onboarding ? <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Onboarding" component={OnboardingScreen}/> : null}
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Login" component={LoginScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Register" component={RegisterScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Register_2" component={RegisterScreen_2}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Register_3" component={RegisterScreen_3}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Recover" component={RecoverScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Reset" component={ResetScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Verification" component={VerificationScreen}/>
      </Stack.Navigator>
    )
}

export default AuthNavigator
