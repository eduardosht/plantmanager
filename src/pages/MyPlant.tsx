import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert
} from 'react-native';

import Button from '../components/Button';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';


import waterdrop from '../assets/waterdrop.png';
import { FlatList } from 'react-native-gesture-handler';
import { plantLoad, PlantProps, plantRemove } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';


export default function MyPlant() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        await plantRemove(plant.id);
                        setMyPlants((oldData) =>
                            oldData.filter((item) => item.id !== plant.id)
                        );

                    } catch (error) {
                        Alert.alert('Não foi possível remover');
                    }
                }
            }
        ])
    }

    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await plantLoad();

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas.`
            );

            setMyPlants(plantsStoraged);
            setLoading(false);
        }

        loadStorageData();
    }, []);


    if (loading)
        return <Load />

    return (
        <View style={style.container}>
            <Header />

            <View style={style.spotlight}>
                <Image
                    source={waterdrop}
                    style={style.spotlightImage}
                />
                <Text style={style.spotlightText}>
                    {nextWatered}
                </Text>
            </View>

            <View style={style.plants}>
                <Text style={style.plantsTitle}>
                    Próximas regadas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary
                            data={item}
                            handleRemove={() => handleRemove(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}
                />
            </View>
        </View>
    );
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20,
    }
})