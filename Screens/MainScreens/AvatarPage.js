import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db, storage } from '../../firebase';
import { collection, getDocs, query, where, orderBy, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

    const formattedDate = `${month} ${date}`;


    const[entryQuestions, setEntryQuestions] = useState(false);

    const moodOptions = [
        { id: 1, color: '#36CEDC', value: 1 },
        { id: 2, color: '#FFEA56', value: 3 },
        { id: 3, color: '#FE797B', value: 5 },
        { id: 4, color: '#8FE968', value: 2 },
        { id: 5, color: '#FFB750', value: 4 },
    ];

    const [selectedValue, setSelectedValue] = useState(null);


    const todayKey = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`; 
    };




    const toDateKey = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const startOfWeekSunday = (date = new Date()) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay(); 
        d.setDate(d.getDate() - day);
        return d;
    };

    const getWeekKeys = (date = new Date()) => {
        const start = startOfWeekSunday(date);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return toDateKey(d);
        });
    };

    const getNextWeekStartKey = (date = new Date()) => {
        const start = startOfWeekSunday(date);
        const next = new Date(start);
        next.setDate(start.getDate() + 7);
        return toDateKey(next);
    };

    const colorForMood = (mood) => {
        const m = Number(mood);
        return (
            moodOptions.find(o => o.value === m)?.color ||
            moodOptions.find(o => o.id === m)?.color ||
            "white"
        );
    };





    const { user } = useAuth();
    const uid = user?.uid;
    const keyToday = todayKey();


    const ENTRY_STORAGE_KEY = uid ? `entry:${uid}/${keyToday}` : null;

    const [todayEntry, setTodayEntry] = useState(null); 



    const [weekSlots, setWeekSlots] = useState(() =>
        getWeekKeys().map(dateKey => ({ dateKey, mood: null }))
    );



    useEffect(() => {
        if (!uid) return;

        const loadWeek = async () => {
            try {
                const weekKeys = getWeekKeys();
                const weekStart = weekKeys[0];              
                const nextWeekStart = getNextWeekStartKey();

                const weekQuery = query(
                    collection(db, 'users', uid, 'entries'),
                    where('dateKey', '>=', weekStart),
                    where('dateKey', '<', nextWeekStart),
                    orderBy('dateKey', 'asc')
                );

                const snap = await getDocs(weekQuery);

                const map = new Map();
                snap.forEach(docSnap => {
                    const data = docSnap.data();
                    map.set(data?.dateKey ?? docSnap.id, data);
                });

                setWeekSlots(
                    weekKeys.map(k => ({
                    dateKey: k,
                    mood: map.get(k)?.mood ?? null,
                    }))
                );
            } catch (e) {
                console.log('Failed to load week entries:', e);
            }
        };

        loadWeek();
    }, [uid, keyToday]);




    useEffect(() => {
        if (!ENTRY_STORAGE_KEY) return;

        const loadEntry = async () => {
            try {
                const raw = await AsyncStorage.getItem(ENTRY_STORAGE_KEY);
                setTodayEntry(raw ? JSON.parse(raw) : null);
            } catch (e) {
                console.log('Failed to load entry:', e);
            }
        };

        loadEntry();
    }, [ENTRY_STORAGE_KEY]);


    const submittedToday = todayEntry?.dateKey === keyToday;

    const dailyMessage = submittedToday ? 'Thank you for submitting your entry' : '* Don\'t forget to fill out your entry *';

    const handleEntrySubmit = async ({ mood, notes, image }) => {
        if (submittedToday) return;

        if (!uid) {
            console.log('No user signed in — cannot save entry.');
            return;
        }

        const entryId = keyToday; 
        const entryRef = doc(db, 'users', uid, 'entries', entryId);

        let imageUrl = null;
        if (image) {
            imageUrl = await uploadImage(image, uid, entryId);
        }

        await setDoc(
            entryRef,
            {
            dateKey: keyToday,
            shortDate: formattedDate,
            mood,
            notes,
            imageUrl,              
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(), 
            },
            { merge: true }
        );

        const newEntry = { dateKey: keyToday, mood, notes, imageUrl };
        await AsyncStorage.setItem(ENTRY_STORAGE_KEY, JSON.stringify(newEntry));

        setTodayEntry(newEntry);

        setWeekSlots(prev =>
            prev.map(s => (s.dateKey === keyToday ? { ...s, mood } : s))
        );

        setSelectedValue(mood);
        setEntryQuestions(false);
    }



    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    }
    
    const uploadImage = async (uri, uid, entryId) => {
        const blob = await uriToBlob(uri);

        const storageRef = ref(storage, `users/${uid}/entries/${entryId}.jpg`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    }




    return (
        <SafeAreaView style={styles.container} > 
            <TopBar />
            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />
                <View style={styles.avatarContainer}>

                    <Text style={[{ fontSize: 60, fontWeight: 'bold', marginVertical: 10 }]}>Avatar</Text>

                </View>
                <ImageMoodDisplay selectedValue={selectedValue}/>

                <View style={[{ flexDirection: 'col' }, styles.inputContainer]}>
                    <Text style={{ color: '#666666' }}>Moods of the Week!</Text>

                    <View style={styles.weekRow}>
                        {weekSlots.map((slot) => (
                            <View
                            key={slot.dateKey}
                            style={[
                                styles.weekSlot,
                                { backgroundColor: slot.mood ? colorForMood(slot.mood) : 'white' },
                            ]}
                            />
                        ))}
                        </View>

                        <View style={styles.weekLabelsRow}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <Text key={i} style={styles.weekLabel}>{d}</Text>
                        ))}
                    </View>


                    <View style={{ flex: 1 }} />  


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

        flexDirection: 'col',
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
        color: '#666666',
        paddingBottom: 35,
    },

    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',
        marginTop: 12,
    },

    weekSlot: {
        width: 38,
        height: 38,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },

    weekLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',
        marginTop: 6,
    },

    weekLabel: {
        width: 38,
        textAlign: 'center',
        fontSize: 12,
        opacity: 0.6,
    },

})

export default AvatarPage;