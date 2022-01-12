import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar } from "react-native";
import { observer } from "mobx-react-lite";
import { AuthStoreContext } from "_stores";
import { Colors, Spacing, Typography } from "_styles";
import EmailIcon from "_assets/images/account/email-icon.svg";
import { scaleSize } from "_styles/mixins";
import { isIphone } from "_utils/helpers";

const HomeHeaderTitle = observer((props) => {
    const authStore = React.useContext(AuthStoreContext)

    const onInbox = () => {
        props.onInbox()
    }

    return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.contentWrapper, isIphone() ? {} : {marginTop: StatusBar.currentHeight}]}>
                    <Text style={styles.name}>Hello {authStore.user.first_name}</Text>
                    <Text style={styles.description}>Welcome to Costa Coffee Club</Text>
                    <Pressable style={styles.icon} onPress={onInbox}>
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
    },
    contentWrapper: {
        paddingHorizontal: Spacing.SPACING_4,
        paddingBottom: Spacing.SPACING_5,
        paddingTop: Spacing.SPACING_1,
    },
    name:{
        color: Colors.WHITE,
        fontFamily:'ManusTrial',
        fontSize: Typography.FONT_SIZE_30,

    },
    description: {
        color: Colors.WHITE,
        fontSize: Typography.FONT_SIZE_22,
        fontFamily: Typography.FONT_SECONDARY_BOLD
    },
    icon: {
        position: 'absolute',
        top: scaleSize(0),
        right: Spacing.SPACING_2
    }
})
