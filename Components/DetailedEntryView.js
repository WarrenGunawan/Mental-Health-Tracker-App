import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, KeyboardAvoidingView, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



function DetailedEntryView({ onClose, onSubmit, selectedValue, setSelectedValue, formattedDate, moodOptions }) {
    const [ notes, setNotes ] = useState('');

    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const sheetTranslateY = useRef(new Animated.Value(600)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(sheetTranslateY, {
                toValue: 0,
                damping: 20,
                stiffness: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const close = (callback) => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(sheetTranslateY, {
                toValue: 600,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
            if (callback) callback();
        });
    };

    const handleSubmit = () => {
        if (selectedValue == null) {
            alert('Pick a mood first!');
            return;
        }
        onSubmit({ mood: selectedValue, notes });
        // onClose is called inside onSubmit flow, no need to animate out separately
    };


    return (
        <KeyboardAvoidingView behavior={'padding'} style={styles.detailedDailyEntryScreen}>
            {/* Fading backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <Pressable style={{ flex: 1 }} onPress={() => close()} />
            </Animated.View>

            {/* Sliding content */}
            <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
                <View style={[{ backgroundColor: '#F4F7FA', padding: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 45, marginBottom: 20, color: '#4A6080' }}>{formattedDate} Entry</Text>

                    <View style={[{ height: 3, width: 280, borderRadius: 3, marginBottom: 20, backgroundColor: '#4A6080' }]} />

                    <Text style={[{ alignSelf: 'flex-start', marginBottom: 20, fontSize: 16, color: '#4A6080' }]}>How are you Feeling?</Text>

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
                                                opacity: !hasSelection || isSelected ? 1 : 0.35,
                                                borderWidth: isSelected ? 3 : 0,
                                                borderColor: 'rgba(0,0,0,0.15)',
                                                transform: [{ scale: isSelected ? 1.05 : 1 }],
                                            },
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.detailedDailyEntry}>
                        <TextInput
                            style={styles.textInputDailyEntry}
                            placeholder={'Additional Notes...'}
                            placeholderTextColor={'rgba(74, 96, 128, 0.4)'}
                            multiline
                            onChangeText={text => setNotes(text)} />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={[styles.submitButton, { padding: 15, fontSize: 20, fontWeight: 'bold', paddingHorizontal: 40, marginRight: 5 }]}>Submit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => close()}>
                            <Text style={[styles.submitButtonOpposite, { padding: 10, fontSize: 20, fontWeight: 'bold', paddingHorizontal: 30, marginLeft: 5 }]}>Exit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}


const SIZE = 80;
const GAP = 16;

const styles = StyleSheet.create({
    submitButton: {
        borderRadius: 20,
        backgroundColor: '#D0DAE8',
        color: '#4A6080',
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitButtonOpposite: {
        borderWidth: 5,
        borderColor: '#D0DAE8',
        borderRadius: 20,
        backgroundColor: 'white',
        color: '#4A6080',
        justifyContent: 'center',
        alignItems: 'center',
    },

    detailedDailyEntry: {
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },

    detailedDailyEntryScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },

    textInputDailyEntry: {
        width: 200,
        height: 100,
        fontSize: 16,
        padding: 10,
        marginVertical: 30,
        backgroundColor: '#D0DAE8',
        borderRadius: 15,
        color: '#4A6080',
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
        width: SIZE * 3 + GAP * 2,
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