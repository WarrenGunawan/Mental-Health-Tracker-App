import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import Wooper from '../assets/images/wooper.png';


const EditableProfileView = () => {
    const navigation = useNavigation();
    
    const [ username, setUsername ] = useState();
    const [ bio, setBio ] = useState('');

    const [originalUsername, setOriginalUsername] = useState('');
    const [originalBio, setOriginalBio] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
            const data = snap.data();
            const u = data.username ?? '';
            const b = data.bio ?? '';

            setUsername(u);
            setBio(b);

            setOriginalUsername(u);
            setOriginalBio(b);
        }
        };

        loadProfile();
    }, []);



    const uid = auth.currentUser.uid;

    const [savedPfpUri, setSavedPfpUri] = useState(null);
    const [draftPfpUri, setDraftPfpUri] = useState(null);

    useEffect(() => {
        const loadPfp = async () => {
            try {
            const raw = await AsyncStorage.getItem(PFP_KEY);
            if (!raw) return;

            const parsed = JSON.parse(raw);
            setSavedPfpUri(parsed?.imageUri ?? null);
            } catch (e) {
            console.log('Failed to load pfp:', e);
            }
        };

        if (uid) loadPfp();
    }, [uid]);

    const displayedPfpUri = draftPfpUri ?? savedPfpUri;

    const pickImage = async() => {
        const perms = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!perms.granted) {
            Alert.alert("Permission to access library was not granted");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if(result.canceled) {
            return;
        }

        let uri = result.assets?.[0]?.uri;
        if (!uri) return;

        try {
            const fileName = uri.split('/').pop() || `pfp-${Date.now()}.jpg`;
            const newPath = FileSystem.documentDirectory + fileName;
            await FileSystem.copyAsync({ from: uri, to: newPath });
            uri = newPath;
        } catch (e) {
            console.log('Failed to persist image, using original uri:', e);
        }

        setDraftPfpUri(uri);
    }

    const PFP_KEY = `pfp:${uid}`;

    const updateProfile = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const updates = {};

        const newUsername = username.trim();
        const newBio = bio.trim();

        if (newUsername !== '' && newUsername !== originalUsername) {
        updates.username = newUsername;
        }

        if (newBio !== '' && newBio !== originalBio) {
        updates.bio = newBio;
        }

        if (Object.keys(updates).length === 0) return;

        await updateDoc(doc(db, 'users', user.uid), updates);

        if (updates.username !== undefined) setOriginalUsername(updates.username);
        if (updates.bio !== undefined) setOriginalBio(updates.bio);
    };

    const goBack = () => {
        setDraftPfpUri(null);
        navigation.navigate('profilepage', {
            mode: 'notEdit',
        })
    };


    const confirmEdits = async () => {
        await updateProfile();

        if (draftPfpUri) {
            const payload = { imageUri: draftPfpUri };
            await AsyncStorage.setItem(PFP_KEY, JSON.stringify(payload));
            setSavedPfpUri(draftPfpUri);
            setDraftPfpUri(null);
        }

        goBack();
    };


    return (
        <View style={styles.profileContainer}>
            
            <TouchableOpacity onPress={pickImage}>
                <Image
                    source={displayedPfpUri ? { uri: displayedPfpUri } : Wooper}
                    style={styles.pfp}/>
            </TouchableOpacity>


            <TextInput style={styles.username} 
                placeholder='New Username?'
                placeholderTextColor={'#666666'}
                autoCorrect={false}
                onChangeText={text => {setUsername(text)}}/>


            <Text style={styles.name}>Warren Gunawan</Text>
            <View style={styles.informationContainer}> 
                <Text style={styles.aboutMeTitle}>About Me!</Text>

                <View style={[{ backgroundColor: '#666666', height: 3, width: '80%', borderRadius: 3 }]}/>
            
                <View>
                    <TextInput style={styles.aboutMe} 
                        placeholder='Edit Here'
                        placeholderTextColor='rgba(0,0,0,0.4)' 
                        onChangeText={text => {setBio(text)}}
                        autoCorrect={false}
                        multiline/>
                </View>

                <View style={[{ backgroundColor: '#666666', height: 3, width: '80%', borderRadius: 3}]}/>

                <View style={{ flexDirection: 'row'}} >
                    <TouchableOpacity onPress={confirmEdits}>
                        <Text style={[styles.submitButton, { fontSize: 20, fontWeight: 'bold'}]}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goBack}>
                        <Text style={[styles.submitButtonOpposite, { paddingHorizontal: 20, paddingVertical: 10, fontSize: 20, fontWeight: 'bold'}]}>Exit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        alignItems: 'center',

        marginTop: 35,
        width: '80%',
        borderRadius: 40,

        backgroundColor: '#DDDDDD',
    },

    pfp: {
        width: 150,
        height: 150,

        borderRadius: 200,
        backgroundColor: '#BBBBBB',
        marginTop: 20,
    },

    username: {
        fontSize: 25,
        marginTop: 10,
        width: '80%',

        textAlign: 'center',
    },

    name: {
        fontSize: 15,
        color: '#666666',
    },

    informationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#BBBBBB',
        borderRadius: 20,

        width: '80%',

        marginTop: 10,
        marginBottom: 30,
    },

    aboutMeTitle: {
        fontSize: 15,
        marginBottom: 10,

        color: '#666666'
    },

    aboutMe: {
        paddingHorizontal: 20,
        paddingVertical: 30,

        fontSize: 20,

        width: 250,
        color: '#666666',
    },

    submitButtonOpposite: {
        borderWidth: 5,
        borderColor: '#DDDDDD',
        borderRadius: 20,
        backgroundColor: 'white',

        color: '#666666',

        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 10,
    },

    submitButton: {
        borderRadius: 20,
        backgroundColor: '#DDDDDD',

        color: '#666666',

        marginTop: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        

        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
})


export default EditableProfileView;