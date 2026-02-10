import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase.js';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import TopBar from '../../Components/TopBar';
import EntryListBox from '../../Components/EntryListBox.js';



const EntryList = () => {

    const user = auth.currentUser;
    const uid = user?.uid;

    const [entries, setEntries] = useState([]);



    useEffect(() => {
        if (!uid) return;

        const entriesRef = collection(db, 'users', uid, 'entries');
        const q = query(entriesRef, orderBy('dateKey', 'asc'));

        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setEntries(list);
        })

        return unsub;
    }, [uid]);

    return (
        <SafeAreaView style={styles.container}>
            <TopBar />
            
            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />

            <ScrollView style={styles.scrollContainer} 
                contentContainerStyle={{ alignItems: 'center' }}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                bounces={true}> 
                
                <Text style={[{ fontSize: 60, fontWeight: 'bold', marginBottom: 10 }]}>Entry List</Text>

                
                
                <View style={styles.entries}>
                    {[...entries].reverse().map((entry) => (
                        <EntryListBox key={entry.id} entry={entry} />
                    ))}
                </View>

                {entries.length === 0 && (
                    <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                        <FontAwesome6 name="face-sad-tear" size={20} color="#666666" />
                        <Text style={[{ alignItems: 'center', justifyContent: 'center', marginLeft: 10, color: '#666666', fontSize: 20 }]}>Entires to be added...</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },

    scrollContainer: {
        flex: 1,
    },

    testButton: {
        backgroundColor: 'black',
        margin: 10,
        padding: 5,
    },

    testText: {
        color: 'white',
        fontSize: 30,
    },

    entries: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
    },
})

export default EntryList;