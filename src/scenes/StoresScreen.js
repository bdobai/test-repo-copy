import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { AuthStoreContext } from '_stores'
import { observer } from 'mobx-react-lite'
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { scaleSize, SCREEN_HEIGHT, SCREEN_WIDTH } from "_styles/mixins";
import { request } from "_utils/request";
import markerIcon from '_assets/images/stores/custom-map-icon.png';
import Geolocation from '@react-native-community/geolocation';
import StoreListItem from "_atoms/StoreListItem";
import Spinner from "_atoms/Spinner";
import { Colors, Spacing } from "_styles";

const StoresScreen = observer((props) => {
    const { user } = React.useContext(AuthStoreContext)
    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState([]);
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            getData(info.latitude, info.longitude)
        });
    },[])

    const getData = (lat, long) => {
        setLoading(true);
        request('/vendor/store/list.json', {
            method: 'GET',
            withToken: true,
            data:{
                distance: 30000,
                unit: 'km',
                limit: 999,
                latitude: '46.771210',
                longitude: '23.6139646',
                language: 1,
            },
            success: function (response) {
                console.debug('response', response.data);
                setStores(response.data);
                setLoading(false);
            },
            error: (error) => {
                console.log('error', error.error)
                setLoading(false);
            }
        });
    }

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
        <View>
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
            {/*<Button type={'outlinePrimary'} square={true} size={'sm'} text={'Order Online'} bodyStyle={styles.smallButton} onPress={() => null}/>*/}
            <FlatList
                data={stores.filter((item) => item.name === 'RAK HOSPITAL')}
                renderItem={({ item }) => <StoreListItem item={item} />}
                ListEmptyComponent={() => <Spinner color={Colors.PRIMARY} size={'large'}/>}
                ItemSeparatorComponent={() => <View style={styles.divider}/>}
                // contentContainerStyle={[styles.contentContainer, !stores?.length ? {flex:1, justifyContent:'center'} : {}]}
            />
        </View>
    )
})

const styles = StyleSheet.create({
    smallButton: {
        width: scaleSize(175),
        alignSelf: 'center',
        height: scaleSize(35)
    },
    divider: {
        alignSelf: 'center',
        width:'95%',
        backgroundColor: Colors.LIGHT_GREY,
        height: 0.5,
        marginVertical: Spacing.SPACING_2
    },
    contentContainer: {
        paddingBottom: Spacing.SPACING_5
    }
})

export default StoresScreen
