import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/core';

import { LinearGradient } from 'expo-linear-gradient';

import Entypo from '@expo/vector-icons/Entypo';

const AvatarPage = () => {

    const navigation = useNavigation();

    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    let date = currentDate.getDate();

    const lastNum = date % 10;
    if(lastNum == 1) {
        date += 'st';
    } else if(lastNum == 2) {
        date += 'nd';
    } else if(lastNum == 3) {
        date += 'rd';
    } else {
        date += 'th';
    }

    const formattedDate = `${month} ${date}`;


    const[entryQuestions, setEntryQuestions] = useState(false);

    const moodOptions = [
        { id: 1, color: '#0aefff', value: 1 },
        { id: 2, color: '#deff0a', value: 3 },
        { id: 3, color: '#ff0000', value: 5 },
        { id: 4, color: '#0aff99', value: 2 },
        { id: 5, color: '#ff8700', value: 4 },
    ];

    const [selectedValue, setSelectedValue] = useState(null);


    const todayKey = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`; // e.g. 2025-12-31
    };

    const [lastSubmittedDate, setLastSubmittedDate] = useState(null);

    const submittedToday = lastSubmittedDate === todayKey();
    const dailyMessage = submittedToday ? "Thank you for submitting your entry" : "Please fill out your entry";


    return (
        <View style={styles.container} > 
        <Text style={{ fontSize: 20, position: 'absolute', top: '45' }}>{formattedDate}</Text>
            <View style={styles.topContainer}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.replace('entrylist')}>
                    <Entypo name='chevron-left' size={18} />
                    <Text style={{ fontSize: 15}}>Entry List</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={{ fontSize: 15 }}>Options</Text>
                </TouchableOpacity>

            </View>

            {/* <View style={{ color: 'black', width: '100%', borderWidth: 1 }}/> */}

            <LinearGradient colors={['rgba(0,0,0,0.35)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 5, width: '100%' }} />

            <View style={styles.avatarContainer}>
                <View style={{ flexDirection: 'row', columnGap: 2, marginLeft: -5 }}>
                    {[...Array(3)].map((_, i) => (
                        <Text key={i} style={{ fontSize: 70 }}>•</Text>
                    ))}
                </View>

                <Text style={[{ fontSize: 60, fontWeight: 'bold' }]}>Avatar</Text>

                <View style={{ flexDirection: 'row', columnGap: 2, marginRight: -5 }}>
                    {[...Array(3)].map((_, i) => (
                        <Text key={i} style={{ fontSize: 70 }}>•</Text>
                    ))}
                </View>
            </View>
            <Entypo name='github' size={300} style={{ marginTop: -30}}/>

            <View style={{ flexDirection: 'row', columnGap: 2, width: '100%', justifyContent: 'center', marginTop: -40, marginBottom: -20  }}>
                {[...Array(30)].map((_, i) => (
                    <Text key={i} style={{ fontSize: 70 }}>•</Text>
                ))}
            </View>

                


            <View style={[{ flexDirection: 'col' }, styles.inputContainer]}>
                <Text style={styles.statusText}>{dailyMessage}</Text>

                <TouchableOpacity style={{ width: '100%' }} onPress={() => {setEntryQuestions(true)}}>
                    <View style={styles.dailyEntryButton}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', padding: 20 }}>Daily Entry</Text>
                    </View>
                </TouchableOpacity>
            </View>


            {entryQuestions && (
                <>
                <View style={styles.detailedDailyEntryScreen}>
                    <TouchableOpacity onPress={() => {setEntryQuestions(false)}} style={{ alignSelf: 'flex-start', marginLeft: 'auto', marginRight: 30, marginBottom: 20 }}>
                        <Entypo name='circle-with-cross' size={67} color='white' />
                    </TouchableOpacity>       

                    <View style={[{ backgroundColor: 'white', padding: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center'  }]}>     
                        <Text style={{fontSize: 45, marginBottom: 20  }}>{formattedDate} Entry</Text>

                        <View style={[{ backgroundColor: 'rgba(0,0,0,0.5)', height: 3, width: 280, borderRadius: 3, marginBottom: 20}]}/>

                        <Text style={[{ alignSelf: 'flex-start', marginBottom: 20, fontSize: 16 }]}>How are you Feeling?</Text>
                        <View style={styles.wrapper}>
                            <View style={styles.grid}>
                                {moodOptions.map((option) => {
                                    const hasSelection = selectedValue !== null;
                                    const isSelected = selectedValue === option.value;

                                return (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => setSelectedValue(option.value)}
                                    activeOpacity={0.9}
                                    style={[
                                    styles.circle,
                                    {
                                        backgroundColor: option.color,
                                        opacity: !hasSelection || isSelected ? 1 : 0.35,  // fade others
                                        borderWidth: isSelected ? 3 : 0,                  // border only selected
                                        borderColor: "rgba(0,0,0,0.15)",
                                        transform: [{ scale: isSelected ? 1.05 : 1 }],    // optional
                                    },
                                    ]}
                                />
                                )
                                })}
                            </View>
                        </View>

                        <View style={styles.detailedDailyEntry}>
                            <Text></Text>
                            <TextInput style={styles.textInputDailyEntry} placeholder={'Additional Notes...'} placeholderTextColor={'rgba(0,0,0,0.5)'} multiline/>
                        </View>

                        <TouchableOpacity onPress={() => {setEntryQuestions(false)}}>
                            <Text style={[styles.dailyEntryButton, { padding: 15, fontSize: 20, fontWeight: 'bold', paddingHorizontal: '50' }]}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </>
            )}

        </View>

        
    )
}

const SIZE = 80;
const GAP = 16;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 40,
    },

    avatarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: -10,
    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        alignItems: 'center',
    },

    inputContainer: {
        flex: 1,
        padding: 20,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: 'black',
        marginVertical: 20,
        width: '90%',

        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    dailyEntryButton: {
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.35)',
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',

        color: 'rgba(0,0,0,0.6)',

        justifyContent: 'center',
        alignItems: 'center',
    },

    detailedDailyEntry: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    detailedDailyEntryScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,

        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    textInputDailyEntry: {
        width: 250,
        height: 100,
        fontSize: 16,

        padding: 10,
        marginVertical: 30,

        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
    },


    wrapper: {
        alignItems: 'center',
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: SIZE * 3 + GAP * 2, // EXACT width of 3 items
        justifyContent: 'center',
        gap: GAP,
    },

    circle: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 4,
    },

    
})

export default AvatarPage;