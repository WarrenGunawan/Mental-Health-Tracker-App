import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

import Entypo from '@expo/vector-icons/Entypo';



function DetailedEntryView({ onClose, formattedDate, moodOptions, mood, notes }) {

    const selectedValue = mood;


    return (
        <View style={styles.detailedDailyEntryScreen}>
            <Pressable style={styles.backdrop} onPress={onClose} />     

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
                            disabled
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
                    <TextInput
                        style={styles.textInputDailyEntry}
                        value={notes ?? ""}
                        editable={false}
                        multiline
                    />
                </View>

                <TouchableOpacity onPress={onClose}>
                    <Text style={[styles.submitButtonOpposite, { padding: 10, fontSize: 20, fontWeight: 'bold', paddingHorizontal: 30, marginLeft: 5 }]}>Exit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const SIZE = 80;
const GAP = 16;

const styles = StyleSheet.create({
    submitButtonOpposite: {
        borderWidth: 5,
        borderColor: 'rgba(0,0,0,0.35)',
        borderRadius: 20,
        backgroundColor: 'white',

        color: 'rgba(0,0,0,0.67)',

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
        ...StyleSheet.absoluteFillObject,
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

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
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
});


export default DetailedEntryView;