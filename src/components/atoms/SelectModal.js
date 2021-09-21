import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Pressable, Button} from 'react-native';
import Theme from '../themes/Theme';
import PropTypes from 'prop-types';
import PickerModal from 'react-native-picker-modal-view';
import Spinner from "./Spinner";

class SelectModal extends PureComponent {

    render() {
        let props = this.props;
        if (!props.items) {
            return  <View
                style={[
                    styles.container,
                    props.styleInput,
                    props.error ? styles.error : null,
                ]}
            />
        }
        if(this.props.loading) {
            return <Spinner visible={true}/>
        }
        return (
            <PickerModal
                renderSelectView={(disabled, selected, showModal) => <Pressable

                        onPress={showModal}
                        style={[
                            styles.container,
                            props.styleInput,
                            props.error ? styles.error : null,
                        ]}
                ><Text style={styles.input}>{selected.Value ? selected.Value : props.value ? props.value.Value : 'Alege'}</Text></Pressable>
                }
                selectPlaceholderText={props.value ? props.value.Value : props.placeholder}
                searchPlaceholderText={'Cauta...'}
                items={props.items}
                onValueChange={props.onChange}
                onBlur={props.onBlur}
                onClosed={props.onSubmitEditing}
                ref={props.inputRef}
                disabled={props.disabled}
                onSelected={props.onSelected}
                selected={props.value}
                requireSelection={true}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={true}
                sortingLanguage={'ro'}
                autoSort={true}
            />
        );
    }
};

SelectModal.propTypes = {
    placeholder: PropTypes.string,
    items: PropTypes.array,
    disabled: PropTypes.bool,
    styleInput: PropTypes.any,
    value: PropTypes.any,
    onSubmitEditing: PropTypes.func,
    inputRef: PropTypes.func,
    onChange: PropTypes.func,
    error: PropTypes.bool,
};

const styles = StyleSheet.create({
    input: {
        paddingVertical: Theme.padding,
        paddingHorizontal: Theme.padding * 2,
        fontSize: 13,
        textAlign: 'left',
        fontFamily: 'Montserrat-Regular',
        color: Theme.Colors.text,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.Colors.form_bg,
        height: 38,
        borderRadius: Theme.borderRadius,
        marginTop: Theme.padding / 2,
        marginBottom: Theme.padding / 2,
        borderWidth: 1,
        borderColor: Theme.Colors.input_border
    },
    error: {
        borderColor: Theme.Colors.error,
    },
    disabled: {
        backgroundColor: Theme.Colors.dark_gray,
        height: 38,
    },
});

export default SelectModal;
