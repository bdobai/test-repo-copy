import React, { useRef, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors, Spacing } from "_styles";
import PropTypes from 'prop-types'
import FormGroup from "_atoms/FormGroup";
import { scaleSize } from "_styles/mixins";
import RNPickerSelect from "react-native-picker-select";
import countries from '_utils/countries.json';
import PickerModal from "react-native-picker-modal-view";

const TextField = React.forwardRef((props, ref) => {
    const inputRef = useRef(null);
    const [passwordHide, setPasswordHide] = useState(props.secure ? props.secure : false);

    const focus = () => {
        let { disabled, editable, type } = props
        let { current: input } = inputRef

        if (!disabled && editable) {
            if(type === 'select'){
                input.togglePicker()
            }else if(type === 'select-modal'){

            }else if(type === 'date' || type === 'datetime'){
                if (Platform.OS === 'ios') {
                    this.actionSheetRef.current?.setModalVisible()
                } else {
                    this.setState({ showDatetimePicker: true })
                }
            }else{
                input.focus()
            }
        }
    }

    const renderSelectedCountry = (disabled, selected, showModal) => {
        const {value} = props;
        return <Pressable onPress={showModal} style={styles.flag}>
            <Image resizeMode={'contain'} style={styles.flagIcon} source={{uri: selected.value?.flag_url || props.value.countryDetails?.flag_url}}/>
            <TextInput editable={false} value={`(+${selected.value?.phone_code || props.value.countryDetails?.phone_code})`} allowFontScaling={false} style={{marginLeft: Spacing.SPACING_1}}/>
        </Pressable>
    }

    const onChange = (value) => {
        props.onChangeText({...props.value, countryDetails: value})
    }

    const renderFlag = () => {
            return <PickerModal
                renderSelectView={renderSelectedCountry}
                selectPlaceholderText={''}
                searchPlaceholderText={''}
                items={countries.map((item) => {
                    return {...item, Name:item.value.name, Value:item.value, Id:item.value}
                })}
                onValueChange={onChange}
                onClosed={() => null}
                onSelected={onChange}
                selected={props.value.countryDetails}
            />
    }

    const renderContent = () => {
        let {disabled, editable, type, items} = props;
        if(type==='select'){
            return (
                <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    fixAndroidTouchableBug={true}
                    items={items}
                    placeholder={{
                        value: 'male',
                        label: 'Male'
                    }}
                    onValueChange={props.onChangeText}
                    style={{
                        inputIOS: [styles.inputStyle],
                        inputAndroid: [styles.selectInput],
                        viewContainer: styles.selectViewContainer,
                        inputIOSContainer: styles.selectInputContainer,
                        inputAndroidContainer: styles.selectInputContainer,
                        headlessAndroidContainer: styles.headlessAndroidContainer,
                    }}
                    doneText={'Select'}
                    editable={!disabled && editable}
                    value={props.value}
                    ref={inputRef}
                    {...props}
                />
            )
        }
        if(type === 'phoneNumber') {
            return (
                    <TextInput
                        allowFontScaling={false}
                        secureTextEntry={passwordHide}
                        style={[
                            styles.inputStyle,
                            props.inputStyle ? props.inputStyle : null,
                            props.editable === false ? styles.disabled : null,
                            props.multiline === true ? { textAlignVertical: 'top', height: 20 * (props.numberOfLines ? props.numberOfLines : 1) } : null,
                        ]}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        ref={ref}
                        editable={props.editable}
                        selectTextOnFocus={false}
                        placeholderTextColor={Colors.GRAY_LIGHT}
                        {...props}
                        onChangeText={(text) => {
                            props.onChangeText({ ...props.value, phone: text })
                        }}
                        keyboardType={"phone-pad"}
                    />
            )
        }
        return (
            <TextInput
                allowFontScaling={false}
                secureTextEntry={passwordHide}
                style={[
                    styles.inputStyle,
                    props.inputStyle ? props.inputStyle : null,
                    props.editable === false ? styles.disabled : null,
                    props.multiline === true ? { textAlignVertical: 'top', height: 20 * (props.numberOfLines ? props.numberOfLines : 1) } : null,
                ]}
                underlineColorAndroid="rgba(0,0,0,0)"
                ref={ref}
                editable={props.editable}
                selectTextOnFocus={false}
                placeholderTextColor={Colors.GRAY_LIGHT}
                {...props}
            />
        )
    }

    return (
        <FormGroup {...props} onSetPasswordHide={setPasswordHide} leftAccessory={props.type === 'phoneNumber' ? renderFlag : props.leftAccessory}>
            {renderContent()}
        </FormGroup>
    )
})

TextField.defaultProps = {
    withShadow: false,
    autoCorrect: false,
}

TextField.propTypes = {
    secureTextEntry: PropTypes.bool,
    editable: PropTypes.bool,
    disabled: PropTypes.bool,
    image: PropTypes.any,
    styleInput: PropTypes.any,
    styleLabel: PropTypes.any,
    value: PropTypes.any,
    name: PropTypes.string,
    multiline: PropTypes.bool,
    onBlur: PropTypes.func,
    numberOfLines: PropTypes.number,
    onSubmitEditing: PropTypes.func,
    autoCapitalize: PropTypes.string,
    onEndEditing: PropTypes.func,
    keyboardType: PropTypes.string,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onChangeText: PropTypes.func,
    error: PropTypes.string,
    textContentType: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    withShadow: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    onPress: PropTypes.func,
    returnKeyType: PropTypes.string,
    inputStyle: PropTypes.any,
    label: PropTypes.string,
    text: PropTypes.string,
}

const styles = StyleSheet.create({
    inputStyle: {
        flex: 1,
        paddingVertical: scaleSize(5),
        marginHorizontal: scaleSize(14),
    },
    disabled: {
        // backgroundColor: Colors.GRAY_LIGHT,
    },
    selectViewContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    selectInputContainer:{
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    headlessAndroidContainer:{
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    flag: {
        flexDirection:'row',
        alignItems:'center',
        paddingLeft: scaleSize(15),
    },
    flagIcon:{
        width:scaleSize(30),
        height: scaleSize(20)
    }
})

export default TextField
