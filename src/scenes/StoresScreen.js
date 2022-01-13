import React, { useEffect, useState } from 'react'
import { Image, StyleSheet } from "react-native";
import { AuthStoreContext } from '_stores'
import { observer } from 'mobx-react-lite'
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { scaleSize, SCREEN_HEIGHT, SCREEN_WIDTH } from "_styles/mixins";
import { request } from "_utils/request";
import markerIcon from '_assets/images/stores/custom-map-icon.png';

const StoresScreen = observer((props) => {
    const { user } = React.useContext(AuthStoreContext)
    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState([]);

    const getData = () => {
        setLoading(true);
        request('/vendor/store/list.json', {
            method: 'GET',
            withToken: true,
            data:{
                distance: 30000,
                unit: 'km',
                limit: 999,
                lat: 46.771210,
                long: 23.6139646,
                language: 1,
            },
            success: function (response) {
                setStores(response.data);
                setLoading(false);
            },
            error: (error) => {
                console.log('error', error.error)
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        getData()
    }, [])

    const renderMarkers = () => {
        return (
            stores.map((item) => <Marker
                key={item}
                coordinate={{
                    latitude: +item.latitude,
                    longitude: +item.longitude,
                }}
            >
                <Image source={markerIcon} style={{width: scaleSize(30), height: scaleSize(30)}}/>
            </Marker>)
        )
    }

    return (
        <MapView
            style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT/2,
            }}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
                latitude: 25.2048,
                longitude: 55.2708,
                latitudeDelta: 10,
                longitudeDelta: 10,
            }}>
            {renderMarkers()}
        </MapView>
    )
})

const styles = StyleSheet.create({

})

export default StoresScreen
