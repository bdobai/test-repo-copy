import React, { useEffect, useRef, useState } from "react";
import { FlatList, Linking, PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import { AuthStoreContext } from '_stores'
import { observer } from 'mobx-react-lite'
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { scaleSize, SCREEN_HEIGHT, SCREEN_WIDTH } from "_styles/mixins";
import { request } from "_utils/request";
import markerIcon from '_assets/images/stores/marker-new.png';
import markerIconBig from '_assets/images/stores/marker-new-big.png';
import Geolocation from '@react-native-community/geolocation';
import StoreListItem from "_atoms/StoreListItem";
import Spinner from "_atoms/Spinner";
import { Colors, Spacing, Typography } from "_styles";
import ActionSheet from "react-native-actions-sheet/index";
import StoreDetails from "_atoms/StoreDetails";
import { createGoogleMapsUrl, isIphone } from "_utils/helpers";

const StoresScreen = observer((props) => {
    const { user } = React.useContext(AuthStoreContext)
    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState([]);
    const [currentStore, setCurrentStore] = useState(null);

    const actionSheetRef = useRef();


    useEffect(() => {
        if(isIphone()) return getData()
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((granted)=>{
            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                getData()
            }
        })
    },[])



    const getData = () => {
        Geolocation.getCurrentPosition(info => {
            setLoading(true);
            request('/vendor/store/list.json', {
                method: 'GET',
                withToken: true,
                data: {
                    distance: 30000,
                    unit: 'km',
                    limit: 999,
                    latitude: info.coords.latitude.toString(),
                    longitude: info.coords.longitude.toString(),
                    language: 1,
                },
                success: function(response) {
                    console.debug('response', response.data);
                    setStores(response.data);
                    setLoading(false);
                },
                error: (error) => {
                    console.log('error', error.error)
                    setLoading(false);
                }
            });
        })
    }

    const renderMarkers = () => {
        return (
            stores.map((item, index) => <Marker
                key={index}
                coordinate={{
                    latitude: +item.latitude,
                    longitude: +item.longitude,
                }}
                onPress={() => onStoreDetails(item)}
                image={currentStore?.id === item.id ? markerIconBig : markerIcon}
                icon={currentStore?.id === item.id ? markerIconBig : markerIcon}
            >
            </Marker>)
        )
    }

    const onStoreDetails = (store) => {
        setCurrentStore(store);
        actionSheetRef.current.setModalVisible(true);
    }

    const onDirections = async () => {
        await Linking.openURL(
            createGoogleMapsUrl(
                currentStore.latitude,
                currentStore.longitude,
            ),
        );
    }

    const renderListEmptyComponent = () => {
        if(loading) return <Spinner color={Colors.PRIMARY} size={'large'}/>
        return (
            <View>
                <Text style={styles.emptyText}>No stores to show</Text>
            </View>
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
                tracksViewChanges={false}
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
                showsVerticalScrollIndicator={false}
                data={stores}
                renderItem={({ item }) => <StoreListItem item={item} onPress={onStoreDetails} />}
                ListEmptyComponent={renderListEmptyComponent}
                ItemSeparatorComponent={() => <View style={styles.divider}/>}
                contentContainerStyle={[styles.contentContainer, !stores?.length ? {height: SCREEN_HEIGHT/3, justifyContent:'center'} : {}]}
            />
            <ActionSheet onClose={() => setCurrentStore(null)} containerStyle={styles.actionSheet} ref={actionSheetRef} safeAreaInnerHeight={0}>
                <StoreDetails store={currentStore} onDirections={onDirections}/>
            </ActionSheet>
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
    },
    actionSheet: {
        borderRadius: 0,
        height: SCREEN_HEIGHT/2,
        borderTopWidth:1,
        borderColor: Colors.BLUE_GRAY,
        marginBottom:0,
        paddingBottom:0,
    },
    smallMarker:{
        width: scaleSize(40),
        height: scaleSize(40)
    },
    bigMarker:{
        width: scaleSize(50),
        height:scaleSize(50)
    },
    emptyText: {
        alignSelf: 'center',
        fontFamily: Typography.FONT_PRIMARY_BOLD,
        color: Colors.PRIMARY,
        fontSize: Typography.FONT_SIZE_16
    }
})

export default StoresScreen
