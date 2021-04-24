import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import userImg from '../assets/eduardo.jpg';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
    const [userName, setUserName] = useState<string>();

    useEffect(() => {
        async function loadStorageUserName() {
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');
        }

        loadStorageUserName();
    }, []);

    return (
        <View style={style.container}>
            <View>
                <Text style={style.greeting}>Olá,</Text>
                <Text style={style.userName}>{userName}</Text>
            </View>

            <Image style={style.image} source={userImg} />
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getStatusBarHeight()
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    greeting: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text,
    },
    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40
    }
})