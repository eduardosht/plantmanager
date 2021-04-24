import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    Platform,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';

import Button from '../components/Button';

import { plantLoad, PlantProps, plantSave } from '../libs/storage';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

import DateTimerPicker, { Event } from '@react-native-community/datetimepicker';

import { useNavigation } from '@react-navigation/core';

import { SvgFromUri } from 'react-native-svg';
import waterdrop from '../assets/waterdrop.png';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useRoute } from '@react-navigation/core';
import { format, isBefore } from 'date-fns';

interface Params {
    plant: PlantProps
}

export default function PlantSave() {
    const route = useRoute();
    const { plant } = route.params as Params;
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');

    const navigation = useNavigation();
    function handleChangeTime(event: Event, dateTime: Date | undefined) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro!');
        }

        if (dateTime)
            setSelectedDateTime(dateTime);
    }

    function handleOpenDatePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave() {
        try {
            await plantSave({
                ...plant,
                dateTimeNotification: selectedDateTime
            })

            navigation.navigate('Confirmation', {
                title: 'Tudo certo',
                subtitle: 'Fique traquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
                buttonTitle: 'Muito obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlant'
            });
        } catch (error) {
            Alert.alert('Não foi possível salvar: ' + error);
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={style.container}
        >
            <View style={style.container}>
                <View style={style.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        width={150}
                        height={150}
                    />
                    <Text style={style.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={style.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={style.controller}>
                    <View style={style.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={style.tipImage}
                        />
                        <Text style={style.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={style.alertLabel}>
                        Escolha o melhor horario para ser lembrado:
                    </Text>

                    {
                        showDatePicker && (
                            <DateTimerPicker
                                value={selectedDateTime}
                                mode="time"
                                display="spinner"
                                onChange={handleChangeTime}
                            />
                        )}

                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity
                                onPress={handleOpenDatePickerForAndroid}
                                style={style.dateTimePickerButton}
                            >
                                <Text style={style.dateTimePickerText}>
                                    {`Mudar horário: ${format(selectedDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    <Button
                        title="Cadastrar planta"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    );
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.shape,
        justifyContent: 'space-between',
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15,
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        fontSize: 17,
        color: colors.heading,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 70
    },
    tipImage: {
        width: 56,
        height: 56,
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        fontSize: 17,
        color: colors.heading,
        marginBottom: 5,
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    }
})