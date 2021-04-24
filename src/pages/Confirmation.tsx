import * as React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Button from '../components/Button';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Params {
    title: string;
    subtitle: string;
    buttonTitle: string;
    icon: 'smile' | 'hug';
    nextScreen: string;
}

const emojis = {
    hug: '🤗',
    smile: '😄',
}

export default function Confirmation() {
    const navigation = useNavigation();
    const routes = useRoute();

    const {
        title,
        subtitle,
        buttonTitle,
        icon,
        nextScreen
    } = routes.params as Params;

    function handleMoveOn() {
        navigation.navigate(nextScreen);
    }

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <Text style={style.emoji}>
                    {emojis[icon]}
                </Text>
                <Text style={style.title}>
                    {title}
                </Text>
                <Text style={style.subTitle}>
                    {subtitle}
                </Text>
                <View style={style.footer}>
                    <Button title={buttonTitle} onPress={handleMoveOn} />
                </View>
            </View>
        </SafeAreaView>
    );
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 30
    },
    emoji: {
        fontSize: 78
    },
    title: {
        fontSize: 22,
        fontFamily: fonts.heading,
        textAlign: 'center',
        color: colors.heading,
        lineHeight: 38,
        marginTop: 15

    },
    subTitle: {
        fontSize: 16,
        fontFamily: fonts.text,
        textAlign: 'center',
        color: colors.heading,
        paddingHorizontal: 20
    },
    footer: {
        width: '100%',
        paddingHorizontal: 75,
        marginTop: 20
    }
})