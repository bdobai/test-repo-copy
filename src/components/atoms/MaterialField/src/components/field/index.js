import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Animated, Platform, StyleSheet, TextInput, View, Pressable, Text, SafeAreaView } from 'react-native'

import Line from '../line'
import Label from '../label'
import Affix from '../affix'
import Helper from '../helper'
import Counter from '../counter'
import { Colors, Typography } from '_styles'
import EyeIcon from '_assets/images/eye.svg'
import EyeSlashIcon from '_assets/images/eye-slash.svg'

import styles from './styles'
import RNPickerSelect from 'react-native-picker-select'
import PickerModal from 'react-native-picker-modal-view'
import DateTimePicker from '@react-native-community/datetimepicker';
import ActionSheet from 'react-native-actions-sheet'
import { dateFormat } from '_utils/helpers'
import dayjs from 'dayjs'

function startAnimation (animation, options, callback) {
    Animated
      .timing(animation, options)
      .start(callback)
}

function labelStateFromProps (props, state) {
    let { placeholder, defaultValue } = props
    let { text, receivedFocus } = state

    return !!(placeholder || text || (!receivedFocus && defaultValue))
}

function errorStateFromProps (props, state) {
    let { error } = props

    return !!error
}

export default class TextField extends PureComponent {
    static defaultProps = {
        underlineColorAndroid: 'transparent',
        disableFullscreenUI: true,
        autoCapitalize: 'sentences',
        editable: true,

        animationDuration: 225,

        fontSize: Typography.FONT_SIZE_18,
        labelFontSize: Typography.FONT_SIZE_10,

        tintColor: Colors.SECONDARY,
        textColor: Colors.WHITE,
        baseColor: Colors.WHITE,

        errorColor: Colors.DANGER,

        lineWidth: StyleSheet.hairlineWidth,
        activeLineWidth: 2,
        disabledLineWidth: 1,

        lineType: 'solid',
        disabledLineType: 'dotted',

        disabled: false,
        secure: false,
    }

    static propTypes = {
        ...TextInput.propTypes,

        animationDuration: PropTypes.number,

        value: PropTypes.any,
        fontSize: PropTypes.number,
        labelFontSize: PropTypes.number,

        contentInset: PropTypes.shape({
            top: PropTypes.number,
            label: PropTypes.number,
            input: PropTypes.number,
            left: PropTypes.number,
            right: PropTypes.number,
        }),

        labelOffset: Label.propTypes.offset,

        // labelTextStyle: Text.propTypes.style,
        // titleTextStyle: Text.propTypes.style,
        // affixTextStyle: Text.propTypes.style,

        tintColor: PropTypes.string,
        textColor: PropTypes.string,
        baseColor: PropTypes.string,

        label: PropTypes.string,
        title: PropTypes.string,

        type: PropTypes.string,

        characterRestriction: PropTypes.number,

        error: PropTypes.string,
        errorColor: PropTypes.string,

        lineWidth: PropTypes.number,
        activeLineWidth: PropTypes.number,
        disabledLineWidth: PropTypes.number,

        lineType: Line.propTypes.lineType,
        disabledLineType: Line.propTypes.lineType,

        disabled: PropTypes.bool,
        secure: PropTypes.bool,

        formatText: PropTypes.func,

        renderLeftAccessory: PropTypes.func,
        renderRightAccessory: PropTypes.func,

        prefix: PropTypes.string,
        suffix: PropTypes.string,

        // containerStyle: (ViewPropTypes || View.propTypes).style,
        // inputContainerStyle: (ViewPropTypes || View.propTypes).style,
    }

    static inputContainerStyle = styles.inputContainer

    static contentInset = {
        top: 0,
        bottom: 0,
        label: 4,
        input: 8,
        left: 0,
        right: 0,
    }

    static labelOffset = {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
    }

    constructor (props) {
        super(props)

        this.onBlur = this.onBlur.bind(this)
        this.onFocus = this.onFocus.bind(this)
        // this.onPress = this.focus.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onContentSizeChange = this.onContentSizeChange.bind(this)
        this.onFocusAnimationEnd = this.onFocusAnimationEnd.bind(this)

        this.createGetter('contentInset')
        this.createGetter('labelOffset')

        this.inputRef = React.createRef()
        this.actionSheetRef = React.createRef();
        this.mounted = false
        this.focused = false

        let { value: text, error, fontSize, secure, type } = this.props

        let labelState = labelStateFromProps(this.props, { text }) ? 1 : 0
        let focusState = errorStateFromProps(this.props) ? -1 : 0

        this.state = {
            text,
            error,
            showDatetimePicker : false,
            focusAnimation: new Animated.Value(focusState),
            labelAnimation: new Animated.Value(labelState),
            colorAnimation: new Animated.Value(labelState),

            receivedFocus: false,
            secured: secure,

            height: fontSize * 1.5,
        }
    }

    static getDerivedStateFromProps ({ error }, state) {
        /* Keep last received error in state */
        if (error && error !== state.error) {
            return { error }
        }

        return null
    }

    createGetter (name) {
        this[name] = () => {
            let { [name]: value } = this.props
            let { [name]: defaultValue } = this.constructor

            return { ...defaultValue, ...value }
        }
    }

    componentDidMount () {
        this.mounted = true
    }

    componentWillUnmount () {
        this.mounted = false
    }

    componentDidUpdate (prevProps, prevState) {
        let errorState = errorStateFromProps(this.props)
        let prevErrorState = errorStateFromProps(prevProps)

        if (errorState ^ prevErrorState) {
            this.startFocusAnimation()
        }

        let labelState = labelStateFromProps(this.props, this.state)
        let prevLabelState = labelStateFromProps(prevProps, prevState)

        if (labelState ^ prevLabelState) {
            this.startLabelAnimation()
        }
    }

    startFocusAnimation () {
        let { focusAnimation } = this.state
        let { animationDuration: duration } = this.props

        let options = {
            toValue: this.focusState(),
            useNativeDriver: false,
            duration,
        }

        startAnimation(focusAnimation, options, this.onFocusAnimationEnd)
    }

    startLabelAnimation () {
        let { labelAnimation, colorAnimation } = this.state
        let { animationDuration: duration } = this.props

        startAnimation(labelAnimation, {
            toValue: this.labelState(),
            useNativeDriver: true,
            duration,
        })

        startAnimation(colorAnimation, {
            toValue: this.labelState(),
            useNativeDriver: false,
            duration,
        })
    }

    setNativeProps (props) {
        let { current: input } = this.inputRef

        input.setNativeProps(props)
    }

    focusState () {
        if (errorStateFromProps(this.props)) {
            return -1
        }

        return this.focused ? 1 : 0
    }

    labelState () {
        if (labelStateFromProps(this.props, this.state)) {
            return 1
        }

        return this.focused ? 1 : 0
    }

    focus () {
        let { disabled, editable, type } = this.props
        let { current: input } = this.inputRef

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

    blur () {
        let { current: input } = this.inputRef

        input.blur()
    }

    clear () {
        let { current: input } = this.inputRef

        input.clear()

        /* onChangeText is not triggered by .clear() */
        this.onChangeText('')
    }

    value () {
        let { text } = this.state
        let { defaultValue } = this.props

        let value = this.isDefaultVisible() ?
          defaultValue :
          text

        if (null == value) {
            return ''
        }

        if (this.props.numberMask) {
            value = this.formatNumber(value, this.props.currency)
        }

        return 'string' === typeof value ?
          value :
          String(value)
    }

    setValue (text) {
        this.setState({ text })
    }

    isFocused () {
        let { current: input } = this.inputRef

        return input.isFocused()
    }

    isRestricted () {
        let { characterRestriction: limit } = this.props
        let { length: count } = this.value()

        return limit < count
    }

    isErrored () {
        return errorStateFromProps(this.props)
    }

    isDefaultVisible () {
        let { text, receivedFocus } = this.state
        let { defaultValue } = this.props

        return !receivedFocus && null == text && null != defaultValue
    }

    isPlaceholderVisible () {
        let { placeholder } = this.props

        return placeholder && !this.focused && !this.value()
    }

    isLabelActive () {
        return 1 === this.labelState()
    }

    onFocus (event) {
        let { onFocus, clearTextOnFocus } = this.props
        let { receivedFocus } = this.state

        if ('function' === typeof onFocus) {
            onFocus(event)
        }

        if (clearTextOnFocus) {
            this.clear()
        }
        if (this.focused) {
            return
        }

        this.focused = true

        this.startFocusAnimation()
        this.startLabelAnimation()

        if (!receivedFocus) {
            this.setState({ receivedFocus: true, text: this.value() })
        }
    }

    onBlur (event) {
        let { onBlur } = this.props

        if ('function' === typeof onBlur) {
            onBlur(event)
        }
        if (!this.focused) {
            return
        }

        this.focused = false

        this.startFocusAnimation()
        this.startLabelAnimation()
    }

    onChange (event) {
        let { onChange } = this.props

        if ('function' === typeof onChange) {
            onChange(event)
        }
    }

    onChangeText (text) {
        let { onChangeText, formatText, mask, numberMask, currency, submitOnFull, onSubmitEditing } = this.props

        if ('function' === typeof formatText) {
            text = formatText(text)
        }
        if (mask && text.length > 0) {
            if(Math.abs(this.value().length - text.length) > 5) {
                text = this.applyTextMask(text, mask)
            }else if (this.value().length < text.length) {
                text = this.formatTextMask(text, mask)
            }
        }else if (numberMask) {
            text = this.formatNumber(text, currency)
        }

        this.setState({ text })

        if ('function' === typeof onChangeText) {
            onChangeText(text)
        }

        if (mask && submitOnFull && mask.length === text.length) {
            onSubmitEditing()
        }
    }

    formatNumber(value, currency) {
        currency = currency ? '$' : '';
        if (typeof value === 'undefined' || value === null || value === '') {
            return 0;
        }
        if (typeof value !== 'string') {
            value = String(value);
        }
        value = value.replace('NaN', '').replace('$', '').replace(/[,]/g, '');
        if (value === '') {
            value = 0
        }

        // return currency + parseFloat(value).toLocaleString('en-US');
        return currency + parseFloat(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    applyTextMask(text, mask) {
        var i = 0,
          v = text.toString();
        return mask.replace(/#/g, _ => v[i++]);
    }

    formatTextMask(text, mask) {
        let v = text.toString();
        let m = mask.toString();
        let final_text = '';
        let i = 0
        while (typeof v[i] !== 'undefined') {
            if(i === v.length -1 && m[i] !== '#' && typeof m[i] !== 'undefined'){
                let c = v[i]
                while (typeof m[i] !== 'undefined' && m[i] !== '#') {
                    final_text += m[i]
                    i++;
                }
                final_text += c
            }else if(m[i] === '#') {
                final_text += v[i]
            }else if(typeof m[i] !== 'undefined'){
                final_text += m[i]
            }
            i++;
        }
        while (typeof m[i] !== 'undefined' && m[i] !== '#') {
            final_text += m[i]
            i++;
        }
        return final_text;
    }

    onContentSizeChange (event) {
        let { onContentSizeChange, fontSize } = this.props
        let { height } = event.nativeEvent.contentSize

        if ('function' === typeof onContentSizeChange) {
            onContentSizeChange(event)
        }

        this.setState({
            height: Math.max(
              fontSize * 1.5,
              Math.ceil(height) + Platform.select({ ios: 4, android: 1 })
            ),
        })
    }

    onFocusAnimationEnd () {
        let { error } = this.props
        let { error: retainedError } = this.state

        if (this.mounted && !error && retainedError) {
            this.setState({ error: null })
        }
    }

    inputHeight () {
        let { height: computedHeight } = this.state
        let { multiline, fontSize, height = computedHeight } = this.props

        return multiline ?
          height :
          fontSize * 1.5
    }

    inputContainerHeight () {
        let { labelFontSize, multiline } = this.props
        let contentInset = this.contentInset()

        if ('web' === Platform.OS && multiline) {
            return 'auto'
        }

        return contentInset.top
          + labelFontSize
          + contentInset.label
          + this.inputHeight()
          + contentInset.input
    }

    inputProps () {
        let store = {}

        for (let key in TextInput.propTypes) {
            if ('defaultValue' === key) {
                continue
            }

            if (key in this.props) {
                store[key] = this.props[key]
            }
        }

        return store
    }

    inputStyle () {
        let { fontSize, baseColor, textColor, disabled, multiline } = this.props

        let color = disabled || this.isDefaultVisible() ?
          baseColor :
          textColor

        let style = {
            fontSize,
            color,

            height: this.inputHeight(),
        }

        if (multiline) {
            let lineHeight = fontSize * 1.5
            let offset = 'ios' === Platform.OS ? 2 : 0

            style.height += lineHeight
            style.transform = [{
                translateY: lineHeight + offset,
            }]
        }

        return style
    }

    renderLabel (props) {
        let offset = this.labelOffset()

        let {
            label,
            fontSize,
            labelFontSize,
            labelTextStyle,
        } = this.props

        return (
          <Label
            {...props}
            fontSize={fontSize}
            activeFontSize={labelFontSize}
            offset={offset}
            label={label}
            style={labelTextStyle}
          />
        )
    }

    renderLine (props) {
        return (
          <Line {...props} />
        )
    }

    renderAccessory (prop) {
        let { [prop]: renderAccessory } = this.props

        return 'function' === typeof renderAccessory ?
          renderAccessory() :
          null
    }

    renderEye () {
        return <Pressable  onPress={() => this.setState({secured: !this.state.secured})}>{this.state.secured ? <EyeIcon height={20} fill={Colors.MUTED}/> : <EyeSlashIcon height={20} fill={Colors.MUTED}/>}</Pressable>
    }

    renderAffix (type) {
        let { labelAnimation } = this.state
        let {
            [type]: affix,
            fontSize,
            baseColor: color,
            affixTextStyle: style,
        } = this.props

        if (null == affix) {
            return null
        }

        let props = {
            type,
            style,
            color,
            fontSize,
            labelAnimation,
        }

        return (
          <Affix {...props}>{affix}</Affix>
        )
    }

    renderHelper () {
        let { focusAnimation, error } = this.state

        let {
            title,
            disabled,
            baseColor,
            errorColor,
            titleTextStyle: style,
            characterRestriction: limit,
        } = this.props

        let { length: count } = this.value()
        let contentInset = this.contentInset()

        let containerStyle = {
            paddingLeft: contentInset.left,
            paddingRight: contentInset.right,
        }

        let styleProps = {
            style,
            baseColor,
            errorColor,
        }

        let counterProps = {
            ...styleProps,
            limit,
            count,
        }

        let helperProps = {
            ...styleProps,
            title,
            error,
            disabled,
            focusAnimation,
        }

        return (
          <View style={[styles.helperContainer, containerStyle]}>
              <Helper {...helperProps} />
              <Counter {...counterProps} />
          </View>
        )
    }

    renderInput () {
        let {
            disabled,
            editable,
            tintColor,
            type,
            items,
            inputStyleOverrides,
        } = this.props

        let props = this.inputProps()
        let inputStyle = this.inputStyle()
        // inputStyle.fontSize = 14

        if(type === 'date' || type === 'datetime') {
            let parsed_value = this.props.value ? dayjs(this.props.value).toDate() : new Date();

            return <View>
                <Text style={inputStyle}>{dateFormat(this.props.value, 'YYYY MMM D')}</Text>
                {Platform.OS === 'ios' ? (
                    <ActionSheet containerStyle={{overflow: 'hidden'}} ref={this.actionSheetRef}>
                        <SafeAreaView>
                            <View style={{alignItems: 'flex-end', paddingVertical: 10, paddingRight: 20}}><Pressable onPress={() => this.actionSheetRef.current?.setModalVisible(false)}><Text style={{fontSize: 16}}>Done</Text></Pressable></View>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={parsed_value}
                                display="spinner"
                                onChange={(event, date) => {
                                    if (date) {
                                        this.onChange(date)
                                        this.onChangeText(date)
                                    }
                                }}
                            />
                        </SafeAreaView>
                    </ActionSheet>
                ) : (
                  this.state.showDatetimePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={parsed_value}
                      display="default"
                      onChange={(event, date) => {
                          this.setState({ showDatetimePicker: false })
                          if (date) {
                              this.onChange(date)
                              this.onChangeText(date)
                          }

                      }}
                    />
                  )
                )}

            </View>
        }

        if(type === 'select'){
            return <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              fixAndroidTouchableBug={true}
              items={items}
              placeholder={{
                  value: null,
                  label: ''
              }}
              onValueChange={(value) => {
                  //TODO inspect dual change
                  this.onChange(value)
                  this.onChangeText(value)
                  if(Platform.OS === 'android') {
                      // this.onBlur();
                      // this.onFocus();
                  }
              }}
              style={{
                  inputIOS: [styles.selectInput, inputStyle, inputStyleOverrides],
                  inputAndroid: [styles.selectInput, inputStyle, inputStyleOverrides],
                  viewContainer: styles.selectViewContainer,
                  inputIOSContainer: styles.selectInputContainer,
                  inputAndroidContainer: styles.selectInputContainer,
                  headlessAndroidContainer: styles.headlessAndroidContainer,
              }}
              onOpen={this.onFocus}
              doneText={'Select'}
              onClose={this.onBlur}
              editable={!disabled && editable}
              value={this.props.value}
              ref={this.inputRef}
              {...props}
            />
        }

        if(type === 'select-modal'){
            return <PickerModal
              renderSelectView={(disabled, selected, showModal) => <Pressable
                onPress={showModal}
                ><Text>{selected.Value ? selected.Value : props.value ? props.value.Value : 'Select'}</Text></Pressable>
              }
              selectPlaceholderText={''}
              searchPlaceholderText={''}
              items={items}
              onValueChange={(value, index) => {this.onChange()}}
              onBlur={this.onBlur}
              // onClosed={this.onChange}
              ref={this.inputRef}
              disabled={disabled || !editable}
              // onSelected={this.onChange}
              selected={this.value()}
              requireSelection={true}
              showAlphabeticalIndex={true}
              autoGenerateAlphabeticalIndex={true}
              sortingLanguage={'ro'}
              autoSort={true}
            />
        }

        return (
          <TextInput
            allowFontScaling={false}
            selectionColor={tintColor}
            underlineColorAndroid="rgba(255,255,255,0)"
            {...props}

            style={[styles.input, inputStyle, inputStyleOverrides]}
            editable={!disabled && editable}
            secureTextEntry={this.state.secured}
            onChange={this.onChange}
            onChangeText={this.onChangeText}
            onContentSizeChange={this.onContentSizeChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={this.value()}
            ref={this.inputRef}
          />
        )
    }

    render () {
        let { labelAnimation, focusAnimation, colorAnimation } = this.state
        let {
            editable,
            disabled,
            lineType,
            disabledLineType,
            lineWidth,
            activeLineWidth,
            disabledLineWidth,
            tintColor,
            baseColor,
            errorColor,
            containerStyle,
            inputContainerStyle: inputContainerStyleOverrides,
        } = this.props

        let restricted = this.isRestricted()
        let contentInset = this.contentInset()

        let inputContainerStyle = {
            paddingTop: contentInset.top,
            paddingRight: contentInset.right,
            paddingBottom: contentInset.input,
            paddingLeft: contentInset.left,
            height: this.inputContainerHeight(),
        }

        let containerProps = {
            style: containerStyle,
            onStartShouldSetResponder: () => true,
            onResponderRelease: this.onPress,
            pointerEvents: !disabled && editable ?
              'auto' :
              'none',
        }

        let inputContainerProps = {
            style: [
                this.constructor.inputContainerStyle,
                inputContainerStyle,
                inputContainerStyleOverrides,
            ],
        }

        let styleProps = {
            disabled,
            restricted,
            baseColor,
            tintColor,
            errorColor,

            contentInset,

            focusAnimation,
            labelAnimation,
            colorAnimation,
        }

        let lineProps = {
            ...styleProps,

            lineWidth,
            activeLineWidth,
            disabledLineWidth,

            lineType,
            disabledLineType,
        }

        return (
          <Pressable onPress={() => this.focus()} {...containerProps}>
              <Animated.View {...inputContainerProps}>
                  {this.renderLine(lineProps)}
                  {this.renderAccessory('renderLeftAccessory')}

                  <View style={styles.stack}>
                      {this.renderLabel(styleProps)}

                      <View style={styles.row}>
                          {this.renderAffix('prefix')}
                          {this.renderInput()}
                          {this.renderAffix('suffix')}
                      </View>
                  </View>
                  {this.props.secure ? this.renderEye() : this.renderAccessory('renderRightAccessory')}
              </Animated.View>

              {this.renderHelper()}
          </Pressable>
        )
    }
}
