import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar } from "react-native";
import { observer } from "mobx-react-lite";
import { AuthStoreContext } from "_stores";
import { Colors, Spacing, Typography } from "_styles";
import EmailIcon from "_assets/images/account/email-icon.svg";
import { scaleSize } from "_styles/mixins";
import { dateFormat, dateFormatLocal, isIphone } from "_utils/helpers";
import dayjs from "dayjs";

const HomeHeaderTitle = observer((props) => {
    const authStore = React.useContext(AuthStoreContext)

    const onInbox = () => {
        props.onInbox()
    }

    const getGreeting = () => {
        const hours = dateFormatLocal(dayjs(Date.now()), 'HH')
        if(hours <= 12)
            return "Good Morning"
        else if(hours <= 17)
            return "Good Afternoon"
        return "Good Evening"
    }

    return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.contentWrapper, isIphone() ? {} : {marginTop: StatusBar.currentHeight}]}>
                    <Text numberOfLines={1} style={styles.name}>{`${getGreeting()} ${authStore.user.first_name}asdfdsfa`}</Text>
                    <Pressable onPress={onInbox}>
                        <EmailIcon fill={'white'}/>
                    </Pressable>
                </View>
            </SafeAreaView>
        )
    }
)

export default HomeHeaderTitle

const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.PRIMARY,
        height: scaleSize(100),
    },
    contentWrapper: {
        paddingHorizontal: Spacing.SPACING_5,
        paddingBottom: Spacing.SPACING_1,
        paddingTop: Spacing.SPACING_1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name:{
        color: Colors.WHITE,
        fontFamily: Typography.FONT_SECONDARY_BOLD,
        fontSize: Typography.FONT_SIZE_26,
        flex: 0.9
    },
})
