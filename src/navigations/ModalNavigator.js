import * as React from 'react'
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from 'react-native'
import { Colors } from '_styles'
import GiftCardBalanceScreen from "_scenes/account/GiftCardBalanceScreen";
import LeftChevron from "_assets/images/left-chevron.svg";
import { scaleSize } from "_styles/mixins";
import { navigationStyles } from "_styles/navigation";
import Messages from "_scenes/Messages";

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.GRAY_MEDIUM
    }
})

function ModalNavigator () {
    return (
      <Stack.Navigator screenOptions={{
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
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Gift Cards" component={GiftCardBalanceScreen}/>
          <Stack.Screen options={{cardStyle: styles.cardStyle}} name="Messages" component={Messages}/>
      </Stack.Navigator>
    )
}

export default ModalNavigator
