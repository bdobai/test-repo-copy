import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet } from 'react-native'
import { Colors } from '_styles'

const Stack = createStackNavigator()

const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: Colors.GRAY_MEDIUM
    }
})

function ModalNavigator () {
    return (
      <Stack.Navigator screenOptions={{
          headerShown: false,
      }}>
          {/*<Stack.Screen options={{cardStyle: styles.cardStyle}} name="Filters" component={FiltersScreen}/>*/}
      </Stack.Navigator>
    )
}

export default ModalNavigator
