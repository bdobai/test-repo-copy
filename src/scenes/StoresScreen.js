import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Linking, PermissionsAndroid, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { scaleSize, SCREEN_HEIGHT, SCREEN_WIDTH } from "_styles/mixins";
import { request } from "_utils/request";
import markerIcon from '_assets/images/stores/marker-new.png';
import markerIconBig from '_assets/images/stores/marker-new-big.png';
import Geolocation from "react-native-geolocation-service";
import { Colors, Spacing, Typography } from "_styles";
import ActionSheet from "react-native-actions-sheet/index";
import { createGoogleMapsUrl, isIphone } from "_utils/helpers";
import StoreListItemNew from "_atoms/StoreListItemNew";
import StoreDetailsNew from "_atoms/StoreDetailsNew";
import currentLocationIcon from '_assets/images/stores/current-location.png';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Spinner from "_atoms/Spinner";

const StoresScreen = (props) => {
    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState([]);
    const [currentStore, setCurrentStore] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [coords, setCoords] = useState({latitude:'25.2048', longitude:'55.2708'});

    const actionSheetRef = useRef();
    const mapRef = useRef();

    const showMandatoryAlert = () => {
        requestData('25.2048','55.2708');
        Alert.alert('Location required', 'Location is needed in order to show the shops near you', [
            {
                text: 'Ok',
                onPress: async () => {
                    try {
                        await Linking.openSettings();
                    } catch (e) {}
                },
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    }

    useEffect(() => {
        if(isIphone()) {
            Geolocation.requestAuthorization('whenInUse')
                .then(() => getData())
                .catch(() => {
                        setLoading(false)
                        showMandatoryAlert()
                    })
        }else{
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((granted)=>{
                if(granted === PermissionsAndroid.RESULTS.GRANTED){
                    getData()
                }else{
                    setLoading(false);
                    showMandatoryAlert()
                }
            })
        }
    },[])

    const requestData = (lat, long) => {
        request('/vendor/store/list.json', {
            method: 'GET',
            withToken: true,
            data: {
                distance: 30000,
                unit: 'km',
                limit: 999,
                latitude: lat,
                longitude: long,
                language: 1,
            },
            success: function(response) {
                setStores(response.data);
                setLoading(false);
            },
            error: () => {
                setLoading(false);
            }
        });
    }

    const getData = () => {
        Geolocation.getCurrentPosition(info => {
            setLoading(true);
            setCoords({latitude: info.coords.latitude, longitude: info.coords.longitude})
            requestData(info.coords.latitude.toString(), info.coords.longitude.toString())
        }, error => {
            setLoading(false)
            showMandatoryAlert()
        }, {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000});
    }

    // https://maps.googleapis.com/maps/api/js?key=AIzaSyAyXQO4HBR9IxE6I-AtVLAi7VCb9KTUsC8&libraries=places,geometry

    const renderMarkers = () => {
        return (
            stores.map((item, index) => <Marker
                key={index}
                coordinate={{
                    latitude: +item.latitude,
                    longitude: +item.longitude,
                }}
                onPress={() => onStoreBasic(item)}
                image={currentStore?.id === item.id ? markerIconBig : markerIcon}
            >
            </Marker>)
        )
    }

    const onStoreBasic = (store) => {
        setCurrentStore(store);
        actionSheetRef.current.setModalVisible(true);
    }

    const onStoreDetails = () => {
        setShowDetails(true);
    }

    const onDirections = async () => {
        await Linking.openURL(
            createGoogleMapsUrl(
                currentStore.latitude,
                currentStore.longitude,
            ),
        );
    }

    const onCloseActionSheet = () => {
        setShowDetails(false)
        setCurrentStore(null)
    }

    // const renderListEmptyComponent = () => {
    //     if(loading) return <Spinner color={Colors.PRIMARY} size={'large'}/>
    //     return (
    //         <View>
    //             <Text style={styles.emptyText}>No stores to show</Text>
    //         </View>
    //     )
    // }

    const renderLoader = () => {
        if(!loading) return;
        return (
            <View style={styles.overlay}>
                <Spinner color={Colors.WHITE}/>
            </View>
        )
    }

    const goToCurrentLocation = () => {
        return mapRef.current.animateToCoordinate(coords)
    }

    const goToLocation = (locationDetails) => {
        return mapRef.current.animateToCoordinate({latitude: locationDetails.geometry.location.lat, longitude: locationDetails.geometry.location.lng})
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <GooglePlacesAutocomplete
                    placeholder='Search by street, city etc'
                    fetchDetails={true}
                    textInputProps={{
                        placeholderTextColor: Colors.BLUE_GRAY
                    }}
                    onPress={(data, details = null) => {
                        goToLocation(details)
                    }}
                    query={{
                        key: 'AIzaSyAyXQO4HBR9IxE6I-AtVLAi7VCb9KTUsC8',
                        language: 'en',
                    }}
                    styles={{
                        textInput: {
                            color: Colors.BLACK,
                        },
                    }}
                />
            </View>
            <MapView
                ref={mapRef}
                showsUserLocation={true}
                showsMyLocationButton={false}
                style={styles.map}
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
            {/*<FlatList*/}
            {/*    showsVerticalScrollIndicator={false}*/}
            {/*    data={stores}*/}
            {/*    renderItem={({ item }) => <StoreListItem item={item} onPress={onStoreDetails} />}*/}
            {/*    ListEmptyComponent={renderListEmptyComponent}*/}
            {/*    ItemSeparatorComponent={() => <View style={styles.divider}/>}*/}
            {/*    contentContainerStyle={[styles.contentContainer, !stores?.length ? {height: SCREEN_HEIGHT/3, justifyContent:'center'} : {}]}*/}
            {/*/>*/}
            {renderLoader()}
            <Pressable onPress={goToCurrentLocation} style={styles.currentLocation}>
                <Image style={styles.currentLocationImage} source={currentLocationIcon} resizeMode={'contain'}/>
            </Pressable>
            <ActionSheet onClose={onCloseActionSheet} containerStyle={styles.actionSheet} ref={actionSheetRef} safeAreaInnerHeight={0}>
                {!showDetails ? <StoreListItemNew item={currentStore} onPress={onStoreDetails}/> : <StoreDetailsNew store={currentStore} onDirections={onDirections}/>}
            </ActionSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
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
    },
    currentLocation: {
        position: 'absolute',
        bottom: scaleSize(24),
        right: scaleSize(24),
        zIndex:50,
    },
    currentLocationImage: {
        width: scaleSize(48),
        height: scaleSize(48),
    },
    map:{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: 'absolute'
    },
    inputWrapper: {
        top: scaleSize(60),
        paddingHorizontal: Spacing.SPACING_4,
        zIndex:20,
        left:0, right:0,
        position:'absolute',
    },
    overlay: {
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
})

export default StoresScreen
