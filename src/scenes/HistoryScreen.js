import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet} from 'react-native'
import { AuthStoreContext } from '_stores'
import { observer } from 'mobx-react-lite'
// import analytics from '@react-native-firebase/analytics'
// import crashlytics from '@react-native-firebase/crashlytics';

const HistoryScreen = observer((props) => {
    const { user } = React.useContext(AuthStoreContext)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = () => {
        setRefreshing(true)
        getData()
    }

    const getData = () => {

    }

    useEffect(() => {
        getData()
    }, [])

    return <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }>

    </ScrollView>
})

const styles = StyleSheet.create({

})

export default HistoryScreen
