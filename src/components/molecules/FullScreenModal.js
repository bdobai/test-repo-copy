import React from 'react'
import { Image, Modal, StyleSheet, Text, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import PropTypes from 'prop-types'
import Theme from '../themes/Theme'
import Button from './Button'

const closeIcon = require('../assets/icons/x.png')

const FullScreenModal = (props) => {

    return <Modal visible={props.isVisible}
                  animationType={'slide'}
                  onRequestClose={() => {
                      props.closeModal()
                  }}
                  onShow={() => {
                      props.onShow ? props.onShow() : false
                  }}
    >
        <SafeAreaView style={stylesModal.modalContainer} forceInset={{ bottom: 'always', top: 'always' }}>
            <View style={stylesModal.header}>
                <Pressable style={stylesModal.closeIconContainer} onPress={() => {
                    props.closeModal()
                }}>
                    <Image style={stylesModal.closeIcon} source={closeIcon}/>
                </Pressable>
                <View style={stylesModal.titleContainer}>
                    {props.title ? <Text style={props.smallTitle ? stylesModal.smallTitle : stylesModal.title}>{props.title}</Text> : null}
                </View>
            </View>
            <View style={stylesModal.body}>
                {props.children}
            </View>
            {props.onSubmit ? <View style={stylesModal.footer}>
                <Button loading={props.buttonLoading} onPress={props.onSubmit} type={'secondary'} text={props.buttonText ? props.buttonText : 'Salveaza'}/>
            </View> : null}
        </SafeAreaView>
    </Modal>
}

FullScreenModal.propTypes = {
    isVisible: PropTypes.bool,
    closeModal: PropTypes.func,
    smallTitle: PropTypes.bool,
    onSubmit: PropTypes.func,
    buttonText: PropTypes.string,
    title: PropTypes.string,
    buttonLoading: PropTypes.bool,
}

const stylesModal = StyleSheet.create({
    closeIconText: {
        fontFamily: 'Montserrat-Bold',
        fontWeight: 'normal',
        fontSize: 24,
        lineHeight: 24,
        color: '#000',
    },
    titleContainer: {
        paddingTop: Theme.padding * 3,
        paddingBottom: Theme.padding * 4,
    },
    smallTitle: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'Montserrat-Light',
        color: Theme.Colors.dark,
        textAlign: 'center'
    },
    title: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 20,
        color: Theme.Colors.dark,
        textAlign: 'left',
        paddingRight: 48
    },
    logo: {
        height: 32,
        width: 170
    },
    closeIconContainer: {
        position: 'absolute',
        right: 0,
        top: 26,
        width: 48,
        height: 48,
        zIndex: 1000,
    },
    closeIcon: {
        width: 24,
        height: 24
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Theme.Colors.white,
    },

    fixBackground: {
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 100,
        zIndex: -1000,
    },
    header: {
        paddingLeft: Theme.padding * 3,
        paddingRight: Theme.padding * 3,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Theme.padding * 3,
        paddingLeft: Theme.padding * 3,
        paddingRight: Theme.padding * 3,
    },
    body: {
        flexDirection: 'column',
        paddingLeft: Theme.padding * 3,
        paddingRight: Theme.padding * 3,
        flex: 1,
    }
})
export default FullScreenModal
