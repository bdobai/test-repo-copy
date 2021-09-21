import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import Header from '_components/molecules/Header'
import PageTitle from '_components/atoms/PageTitle'
import Card from '_components/atoms/Card'
import Container from '_components/atoms/Container'
import BackButton from '_atoms/BackButton'
import { request } from '_utils/request'
import Spinner from '_atoms/Spinner'
import HTML from 'react-native-render-html'
import { HTMLStyles } from '_utils/html_styles'
import * as Spacing from '_styles/spacing'
import IconPlaceholder from '_atoms/IconPlaceholder'
import { HEADER_SPACE } from '_styles/spacing'

const ChangePasswordScreen = (props) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        name: '',
        content: ''
    });

    const getdata = (code) => {
        setLoading(true)
        request('/page', {
            method: 'GET',
            data: {
                code: code
            },
            success: function (response) {
                setLoading(false)
                setData(response.page)
            },
            error: () => {
                setLoading(false)
            }
        });
    };

    useEffect(() => {
        setData({
            name: props.route.params.title,
            content: ''
        })
        getdata(props.route.params.code);
    }, [props])

    useEffect(() => {
        setData({
            name: props.route.params.title,
            content: ''
        })
        getdata(props.route.params.code);
    }, [])

    return <View style={{flex: 1}}>
        <Header left={<BackButton/>} center={<PageTitle size={'small'} title={data.name}/>} right={<IconPlaceholder/>}/>
        <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: HEADER_SPACE}}>
            <Container style={{ flex: 1, paddingBottom: Spacing.SPACING_5 }}>
                <Card>
                    {loading ? <Spinner visible={loading}/> : <View>
                        <HTML html={data.content}
                           imagesMaxWidth={Dimensions.get('window').width}
                           onLinkPress={(evt, href) => this.handleUrl(href)}
                           classesStyles={HTMLStyles.classesStyles}
                           baseFontStyle={HTMLStyles.baseFontStyle}
                           ignoredStyles={['display', 'width', 'height', 'font-family', 'padding']}
                           tagsStyles={HTMLStyles.tagsStyles}/>
                    </View>
                    }
                </Card>
            </Container>
        </ScrollView>
    </View>
}

export default ChangePasswordScreen
