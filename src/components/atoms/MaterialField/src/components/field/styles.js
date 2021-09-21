import { I18nManager, StyleSheet } from 'react-native'

export default StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    input: {
        top: 2,
        padding: 0,
        borderBottomColor: 'transparent',
        borderBottomWidth: 0,
        paddingTop: 0, /* XXX: iOS has paddingTop set for multiline input */
        margin: 0,
        flex: 1,

        textAlign: I18nManager.isRTL ?
          'right' :
          'left',

        includeFontPadding: false,
        textAlignVertical: 'top',
    },

    selectInput: {
        padding: 0,
        margin: 0,
        textAlign: I18nManager.isRTL ?
          'right' :
          'left',
        includeFontPadding: false,
        textAlignVertical: 'top',
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'black'
    },

    selectViewContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        // borderWidth: 1,
        // borderColor: 'red'
    },
    selectInputContainer:{
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        // borderWidth: 1,
        // borderColor: 'green',
        // padding: 0
    },
    headlessAndroidContainer:{
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        // borderWidth: 1,
        // borderColor: 'yellow',
        // padding: 0
    },

    helperContainer: {
        minHeight: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    stack: {
        flex: 1,
        alignSelf: 'stretch',
        height: '100%'
    },

    flex: {
        flex: 1,
    },
})
