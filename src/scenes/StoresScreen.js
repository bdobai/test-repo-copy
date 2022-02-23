import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Image, Keyboard,
    Linking,
    PermissionsAndroid,
    Platform,
    Pressable,
    SafeAreaView, StatusBar,
    StyleSheet,
    Text, TextInput,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { scaleSize, SCREEN_HEIGHT, SCREEN_WIDTH } from "_styles/mixins";
import { request } from "_utils/request";
import markerIcon from '_assets/images/stores/marker-new.png';
import markerIconBig from '_assets/images/stores/marker-new-big.png';
import markerIconSmall from '_assets/images/stores/marker-new-small.png';
import searchIcon from '_assets/images/stores/search.png';
import filterIcon from '_assets/images/stores/filter.png';
import Geolocation from "react-native-geolocation-service";
import { Colors, Spacing, Typography } from "_styles";
import ActionSheet from "react-native-actions-sheet";
import { createGoogleMapsUrl, isIphone } from "_utils/helpers";
import StoreListItemNew from "_atoms/StoreListItemNew";
import StoreDetailsNew from "_atoms/StoreDetailsNew";
import currentLocationIcon from '_assets/images/stores/current-location.png';
import Spinner from "_atoms/Spinner";
import StoresFilters from "_atoms/StoresFilters";
import { visilabsApi } from "_utils/analytics";
import { ScrollView } from "react-native-gesture-handler";

const StoresScreen = (props) => {
    const [loading, setLoading] = useState(true)
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);
    const [currentStore, setCurrentStore] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [availability, setAvailability] = useState(false)
    const [onlineOrdering, setOnlineOrdering] = useState(false)
    const [coords, setCoords] = useState({latitude:'25.2048', longitude:'55.2708'});
    const [searchedStores, setSearchedStores] = useState([]);

    const actionSheetRef = useRef();
    const filtersActionSheetRef = useRef();
    const mapRef = useRef();
    const inputRef = useRef();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', (e) => {
            visilabsApi.customEvent('Stores');
            StatusBar.setBarStyle('dark-content')
            if(!isIphone()){
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor('transparent');
            }
        });
        return unsubscribe;
    }, [props.navigation]);

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
                setFilteredStores(response.data);
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

    const renderMarkers = () => {
        return (
            filteredStores.map((item, index) => <Marker
                key={index}
                coordinate={{
                    latitude: +item.latitude,
                    longitude: +item.longitude,
                }}
                onPress={() => onStoreBasic(item)}
                image={markerIconSmall}
            >
            </Marker>)
        )
    }

    const onStoreBasic = (item) => {
        setSearch('');
        inputRef.current.blur()
        Keyboard.dismiss();
        mapRef.current.animateToRegion({
            latitude: +item.latitude,
            longitude: +item.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        })
        setSearchedStores([]);
        setCurrentStore(item);
        if(searchFocused){
            setTimeout(() =>{
                actionSheetRef.current.setModalVisible(true);
            },500)
        }else {
            actionSheetRef.current.setModalVisible(true);
        }
    }

    const onStoreDetails = () => {
        setShowDetails(true);
    }

    const onDirections = async () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${currentStore.latitude},${currentStore.longitude}`;
        const label = currentStore.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        try{
            await Linking.openURL(url);
        }catch (e){
            await Linking.openURL(
                createGoogleMapsUrl(
                    currentStore.latitude,
                    currentStore.longitude,
                ),
            );
        }

    }

    const onCloseActionSheet = () => {
        setShowDetails(false)
        setCurrentStore(null)
    }

    const renderLoader = () => {
        if(!loading) return;
        return (
            <View style={styles.overlay}>
                <Spinner color={Colors.WHITE}/>
            </View>
        )
    }

    const goToCurrentLocation = () => {
        return mapRef.current.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        })
    }

    const goToLocation = (locationDetails) => {
        if(!isIphone()){
            return mapRef.current.animateCamera({
                center:{ latitude: locationDetails.geometry.location.lat, longitude: locationDetails.geometry.location.lng},
                zoom: 15
            })
        }
        return mapRef.current.fitToCoordinates(
            [{latitude: locationDetails.geometry.viewport.northeast.lat, longitude: locationDetails.geometry.viewport.northeast.lng.toString()},
                {latitude: locationDetails.geometry.viewport.southwest.lat, longitude: locationDetails.geometry.viewport.southwest.lng.toString()}],
            {
                edgePadding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                },
            }
        )
    }

    const renderSearchButton = () => {
        return (
            <View style={styles.searchWrapper}>
                <Image source={searchIcon} style={styles.search} resizeMode={'contain'}/>
            </View>
        )
    }

    const onFilters = () => {
        filtersActionSheetRef.current.setModalVisible(true);
    }

    const onSaveFilters = (availability, onlineOrdering) => {
        let filteredStores = [...stores];
        if(availability === true){
            filteredStores = filteredStores.filter((item) => item.store_hours.is_open === true)
        }
        if(onlineOrdering === true) {
            filteredStores = filteredStores.filter((item) => !!item.vendor_attribute?.length && !!item.vendor_attribute[0].link)
        }
        setFilteredStores([...filteredStores]);
        setAvailability(availability);
        setOnlineOrdering(onlineOrdering)
        filtersActionSheetRef.current.setModalVisible(false);
    }

    const onClearFilters = () => {
        setFilteredStores([...stores]);
        setAvailability(false);
        setOnlineOrdering(false);
        filtersActionSheetRef.current.setModalVisible(false)
    }

    const onChangeSearch = (value) => {
        setSearch(value);
        if(!value) return;
        const search = stores.filter((item) => {
            return item.address_line_1?.toLowerCase()?.includes(value.toLowerCase()) ||
                item.address_line_2?.toLowerCase()?.includes(value.toLowerCase()) ||
                item.address_line_3?.toLowerCase()?.includes(value.toLowerCase()) ||
                item.city?.toLowerCase()?.includes(value.toLowerCase()) ||
                item.name?.toLowerCase()?.includes(value.toLowerCase())
        })
        setSearchedStores([...search]);
    }

    const renderSearched = () => {
        if(!searchedStores?.length) return;
        return (
            <View style={styles.floating}>
                <ScrollView keyboardShouldPersistTaps={'always'}>
                    {searchedStores.map((item, index) => {
                        return <Pressable onPress={() => onStoreBasic(item)} key={index}><Text style={styles.searchedName}>{item.name}</Text></Pressable>
                    })}
                </ScrollView>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <Pressable onPress={onFilters}>
                    <View style={[styles.searchWrapper, styles.filterWrapper]}>
                        <Image source={filterIcon} style={styles.search} resizeMode={'contain'}/>
                    </View>
                </Pressable>
                <View style={{flex:1}}>
                    <TextInput
                        ref={inputRef}
                        value={search}
                        onChangeText={onChangeSearch}
                        style={styles.textInput}
                        placeholder={'Search by street, city etc'}
                        placeholderTextColor={Colors.BLUE_GRAY}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {renderSearched()}
                </View>
                {renderSearchButton()}
            </View>
            <MapView
                onPress={() => {
                    Keyboard.dismiss();
                    setSearchedStores([])
                }}
                ref={mapRef}
                showsUserLocation={true}
                showsMyLocationButton={false}
                style={styles.map}
                provider={isIphone() ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
                tracksViewChanges={false}
                initialRegion={{
                    latitude: 25.2048,
                    longitude: 55.2708,
                    latitudeDelta: 2.2,
                    longitudeDelta: 2.2,
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
            <ActionSheet
                onClose={onCloseActionSheet}
                containerStyle={styles.actionSheet}
                ref={actionSheetRef}
                safeAreaInnerHeight={0}
                gestureEnabled={true}
                indicatorColor={'#404042'}
                initialOffsetFromBottom={isIphone() ? 0.19 : 0.15}
            >
                <View>
                    <StoreListItemNew item={currentStore} onPress={onStoreDetails}/>
                    <StoreDetailsNew store={currentStore} onDirections={onDirections}/>
                </View>
            </ActionSheet>
            <ActionSheet containerStyle={styles.actionSheet} ref={filtersActionSheetRef} safeAreaInnerHeight={0}>
                <StoresFilters onSave={onSaveFilters} onClear={onClearFilters} availability={availability} onlineOrdering={onlineOrdering}/>
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
        marginHorizontal: Spacing.SPACING_4,
        zIndex:20,
        left:0,
        right:0,
        position:'absolute',
        flexDirection: 'row',
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
    },
    searchWrapper:{
        backgroundColor: Colors.PRIMARY,
        width: scaleSize(63),
        height: scaleSize(44),
        borderTopRightRadius: scaleSize(22),
        borderBottomRightRadius: scaleSize(22),
        justifyContent: 'center',
        alignItems: 'center',
    },
    search: {
        width: scaleSize(20),
        height: scaleSize(20),
    },
    filterWrapper:{
        borderRadius: scaleSize(22),
        marginRight: Spacing.SPACING_5
    },
    textInput:{
        color: Colors.BLACK,
        borderTopLeftRadius: scaleSize(22),
        borderBottomLeftRadius: scaleSize(22),
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        height: scaleSize(44),
        flex:1,
        backgroundColor: Colors.WHITE,
        paddingLeft: Spacing.SPACING_4,
    },
    floating: {
        minHeight: 40,
        maxHeight: 200,
        backgroundColor: Colors.WHITE,
    },
    searchedName: {
        paddingVertical: Spacing.SPACING_2,
        paddingLeft: Spacing.SPACING_1,
    }
})

export default StoresScreen
