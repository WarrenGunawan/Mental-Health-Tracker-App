import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db } from '../../firebase';
import { setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

import DetailedEntryView from '../../Components/DetailedEntryView';
import ImageMoodDisplay from '../../Components/ImageMoodDisplay';
import SubmittedDetailedEntryView from '../../Components/SubmittedDetailedEntryView';
import TopBar from '../../Components/TopBar';

import { useAuth } from '../../AuthContext';


const AvatarPage = () => {


    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    let date = currentDate.getDate();
    const year = currentDate.getFullYear();

    const lastNum = date % 10;
    const secondToLastNum = Math.floor(date / 10);
    if(lastNum == 1) {
        date += 'st';
    } else if(lastNum == 2) {
        if(secondToLastNum == 1) {
            date +='th';
        } else {
            date += 'nd';
        }
    } else if(lastNum == 3) {
        if(secondToLastNum == 1) {
            date +='th';
        } else {
            date += 'rd';
        }
    } else {
        date += 'th';
    }

    const formattedDateWithYear = `${month} ${date} ${year}`;
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
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`; // e.g. 2025-12-31
    };


    const ENTRY_STORAGE_KEY = 'today_entry_v1';

    const [todayEntry, setTodayEntry] = useState(null); 

    useEffect(() => {
    const loadEntry = async () => {
        try {
        const raw = await AsyncStorage.getItem(ENTRY_STORAGE_KEY);
        if (raw) setTodayEntry(JSON.parse(raw));
        } catch (e) {
        console.log('Failed to load entry:', e);
        }
    };
    loadEntry();
    }, []);


    const keyToday = todayKey();
    const submittedToday = todayEntry?.dateKey === keyToday;

    const dailyMessage = submittedToday ? 'Thank you for submitting your entry' : 'Please fill out your entry';


    const [ selectedOptions, setSelectedOptions ] = useState(false);



    const { user } = useAuth();
    const uid = user?.uid;

    const handleEntrySubmit = async ({ mood, notes }) => {
        if (submittedToday) return; 

        if (!uid) {
            console.log('No user signed in — cannot save entry.');
            return;
        }

        const newEntry = { dateKey: keyToday, mood, notes };

        setTodayEntry(newEntry);


        const snap = await getDoc(entryRef);
        const isNew = !snap.exists();

        const entryRef = doc(db, 'users', uid, 'entries', keyToday);
        await setDoc(
            entryRef,
            {
                dateKey: keyToday,           
                mood,            
                notes,             
                updatedAt: serverTimestamp(),
                ...(isNew ? { createdAt: serverTimestamp() } : {}),
            },
            {merge: true}
        );

        await AsyncStorage.setItem(ENTRY_STORAGE_KEY, JSON.stringify(newEntry));

        setSelectedValue(mood);
        setEntryQuestions(false);
    }







    return (
        <SafeAreaView style={styles.container} > 
            <TopBar />

            {/* <View style={{ color: 'black', width: '100%', borderWidth: 1 }}/> */}

            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />
                <View style={styles.avatarContainer}>
                    {/* <View style={{ flexDirection: 'row', columnGap: 2, marginLeft: -5 }}>
                        {[...Array(3)].map((_, i) => (
                            <Text key={i} style={{ fontSize: 70 }}>•</Text>
                        ))}
                    </View> */}

                    <Text style={[{ fontSize: 60, fontWeight: 'bold', marginVertical: 10 }]}>Avatar</Text>

                    {/* <View style={{ flexDirection: 'row', columnGap: 2, marginRight: -5 }}>
                        {[...Array(3)].map((_, i) => (
                            <Text key={i} style={{ fontSize: 70 }}>•</Text>
                        ))}
                    </View> */}
                </View>
                <ImageMoodDisplay selectedValue={selectedValue}/>

                {/* <View style={{ flexDirection: 'row', columnGap: 2, width: '100%', justifyContent: 'center', marginTop: -40, marginBottom: -20  }}>
                    {[...Array(30)].map((_, i) => (
                        <Text key={i} style={{ fontSize: 70 }}>•</Text>
                    ))}
                </View> */}

            

                <View style={[{ flexDirection: 'col' }, styles.inputContainer]}>
                    <Text style={styles.statusText}>{dailyMessage}</Text>

                    <TouchableOpacity style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={() => {setEntryQuestions(true)}}>
                        <Text style={[ styles.dailyEntryButton, { fontSize: 26, fontWeight: 'bold', padding: 20, paddingHorizontal: 85 }]}>{submittedToday? 'View Entry' : 'Daily Entry'}</Text>
                    </TouchableOpacity>
                </View>





                {entryQuestions && (
                    submittedToday ? (
                        <SubmittedDetailedEntryView onClose={() => setEntryQuestions(false)}
                            formattedDate={formattedDate}
                            moodOptions={moodOptions}
                            mood={todayEntry.mood}
                            notes={todayEntry.notes} />
                    ) : (
                        <DetailedEntryView onClose={() => setEntryQuestions(false)} 
                            onSubmit={handleEntrySubmit}
                            selectedValue={selectedValue} 
                            setSelectedValue={setSelectedValue}
                            formattedDate={formattedDate}
                            moodOptions={moodOptions} />
                    )
                )}

        </SafeAreaView>

        
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },

    avatarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: -10,
    },

    inputContainer: {
        flex: 1,
        padding: 20,
        borderRadius: 30,
        backgroundColor: '#DDDDDD',
        width: '90%',

        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    dailyEntryButton: {
        borderRadius: 20,
        backgroundColor: '#BBBBBB',

        color: '#666666',

        justifyContent: 'center',
        alignItems: 'center',
    },
    
    statusText: {
        marginBottom: 60,
    },
})

export default AvatarPage;