import * as React from 'react';
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { useState } from "react";
import Star from '_assets/images/history/star.svg'
import StarOutline from '_assets/images/history/star-outline.svg'
import { Colors, Spacing } from "_styles";
import { scaleSize } from "_styles/mixins";
import Button from "_atoms/Button";

const STARS = [1,2,3,4,5]

const FeedbackSection = (props) => {
    const [selectedStar, setSelectedStar] = useState(0);
    const [comment, setComment] = useState('');

    const renderStar = (item) => {
        if(item <= selectedStar){
            return <Star fill={Colors.PRIMARY} width={scaleSize(24)} height={scaleSize(24)} style={styles.icon}/>
        }
        return <StarOutline fill={Colors.PRIMARY} width={scaleSize(24)} height={scaleSize(24)} style={styles.icon}/>
    }

    const renderStars = () => STARS.map((item) => (
        <Pressable onPress={() => setSelectedStar(item)}>
            {renderStar(item)}
        </Pressable>
    ))

    const onSendFeedback = () => {
        props.onSendFeedback(selectedStar, comment);
    }

    return (
        <View>
            <View style={styles.container}>
                {renderStars()}
            </View>
            <TextInput
                multiline={true}
                style={styles.input}
                value={comment}
                onChangeText={(value) => setComment(value)}
            />
            <Button
                type={'primary'}
                square={true}
                size={'sm'}
                text={'Send Feedback'}
                bodyStyle={styles.smallButton}
                onPress={onSendFeedback}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: Spacing.SPACING_2,
    },
    icon: {
        marginHorizontal: Spacing.SPACING_1/2
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.MUTED,
        height: scaleSize(80),
        borderRadius: scaleSize(12),
        paddingHorizontal: Spacing.SPACING_4,
        color: Colors.BLACK
    },
    smallButton: {
        width: scaleSize(225),
        alignSelf: 'center',
        height: scaleSize(35),
        marginTop: Spacing.SPACING_4
    },
})

export default FeedbackSection
