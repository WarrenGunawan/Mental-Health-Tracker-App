import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

import { db, auth } from '../firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Wooper from '../assets/images/wooper.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditProfileView from './EditProfileView.js';


const ProfileView = () => {
    const [ edit, setEdit ] = useState();




    const uid = auth.currentUser.uid;
    const PFP_KEY = `pfp:${uid}`;

    const [ pfpUri, setPfpUri ] = useState(null);

    useEffect(() => {
        const loadPfp = async () => {
            try {
                const raw = await AsyncStorage.getItem(PFP_KEY);
                if (!raw) return;

                const parsed = JSON.parse(raw);
                setPfpUri(parsed?.imageUri ?? null);
            } catch (e) {
                console.log('Failed to load pfp:', e);
            }
        };

        if (uid) loadPfp();
    }, [uid]);

    
    
    const [ name, setName ] = useState();
    const [ username, setUsername] = useState();
    const [ bio, setBio ] = useState();

    
    useEffect(() => {
        const user = auth.currentUser;

        const loadString = async () => {
            const snap = await getDoc(doc(db, 'users', user.uid));
            if (snap.exists()) {
                setName(snap.data().name);
                setUsername(snap.data().username);
                setBio(snap.data().bio);
            }
        };

        loadString(user);
    }, []);



    return (
        <View style={styles.profileContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => {setEdit(true)}}>
                <MaterialCommunityIcons  name='account-edit-outline' size={30} color='#4A6080' />
            </TouchableOpacity>
            <Image
                source={pfpUri ? { uri: pfpUri } : Wooper}
                style={styles.pfp}/>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.informationContainer}> 
                <Text style={styles.aboutMeTitle}>About Me!</Text>
                <View style={[{ backgroundColor: '#4A6080', height: 3, width: '80%', borderRadius: 3 }]}/>

                <View>
                    <Text style={styles.aboutMe}>{bio}</Text>
                </View>

                <View style={[{ backgroundColor: '#4A6080', height: 3, width: '80%', borderRadius: 3 }]}/>
            </View>


            {edit && (
                <EditProfileView onClose={() => {setEdit(false)}} />
            )}

        </View>
    )
}


const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        alignItems: 'center',

        marginTop: 35,
        width: '90%',
        borderRadius: 30,

        backgroundColor: '#E0E9F1',
    },

    pfp: {
        width: 150,
        height: 150,

        borderRadius: 200,
        backgroundColor: '#D0DAE8',
        marginTop: 20,
    },

    username: {
        fontSize: 30,
        marginTop: 10,
        color: '#4A6080'
    },

    name: {
        fontSize: 15,
        color: '#4A6080',
    },

    informationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#E0E9F1',
        borderRadius: 20,

        width: '100%',
        
        marginTop: 10,
        marginBottom: 30,
    },

    aboutMeTitle: {
        fontSize: 15,
        paddingBottom: 10,

        color: '#4A6080'
    },

    aboutMe: {
        fontSize: 20,
        padding: 20,
        color: '#4A6080',
    },

    editButton: {
        position: 'absolute',
        margin: 20,
        right: 0,
        
    },
})


export default ProfileView;