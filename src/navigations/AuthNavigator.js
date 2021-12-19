import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from '_scenes/auth/LoginScreen'
import RegisterScreen from '_scenes/auth/RegisterScreen'
import RegisterScreen_2 from '_scenes/auth/RegisterScreen_2'
import ConfirmSmsScreen from '_scenes/auth/ConfirmSmsScreen'
import VerificationScreen from '_scenes/auth/VerificationScreen'
import { StyleSheet } from 'react-native'
import RecoverScreen from '_scenes/auth/RecoverScreen'
import ResetScreen from '_scenes/auth/ResetScreen'
import OnboardingScreen from '_scenes/OnboardingScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors, Spacing, Typography } from "_styles";
import LandingScreen from "_scenes/auth/LandingScreen";
import BackButton from "_atoms/BackButton";
import { scaleSize } from "_styles/mixins";

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.PRIMARY
    },
    authHeader: {
        borderWidth:0,
        elevation:0,
        shadowColor:'white',
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
    // const [onboarding, setOnboarding] = useState(null)
    //
    // const getOnboarding = async () => {
    //     try {
    //         const seenOnboarding = await AsyncStorage.getItem('Onboarding')
    //         setOnboarding(false)
    //         // setOnboarding(seenOnboarding === '1')
    //         // if(seenOnboarding === '1'){
    //         //     props.navigation.navigate('Login')
    //         // }
    //     } catch (e) {
    //
    //     }
    // }
    //
    // useEffect(() => {
    //     getOnboarding()
    // }, [])
    //
    // if (onboarding === null) {
    //     return <></>
    // }

    const authOptions = {
        cardStyle: styles.cardStyle,
        headerShown: true,
        headerStyle: styles.authHeader,
        headerTitle: '',
        headerLeft:() => <BackButton color={Colors.PRIMARY}/>,
        height: scaleSize(112),
    }

    return (
      <Stack.Navigator screenOptions={{
          headerShown: false,
      }}>
          {/*{!onboarding ? <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Onboarding" component={OnboardingScreen}/> : null}*/}
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Landing" component={LandingScreen}/>
          <Stack.Screen name="Login" component={LoginScreen} options={authOptions}/>
          <Stack.Screen name="Register" component={RegisterScreen} options={authOptions}/>
          <Stack.Screen name="Register_2" component={RegisterScreen_2} options={authOptions}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Register_3" component={ConfirmSmsScreen}/>
          <Stack.Screen name="Recover" component={RecoverScreen} options={{
              ...authOptions,
              headerLeft: () => <BackButton colors={Colors.WHITE}/>,
              headerTitle: 'Forgot Password',
              headerTitleStyle: styles.headerTitle,
              headerStyle: {
                  backgroundColor:Colors.PRIMARY,
                  borderColor: Colors.PRIMARY,
                  shadowColor: Colors.PRIMARY,
              }

          }}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Reset" component={ResetScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Verification" component={VerificationScreen}/>
      </Stack.Navigator>
    )
}

export default AuthNavigator
