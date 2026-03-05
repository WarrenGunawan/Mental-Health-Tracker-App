import { Text, View, StyleSheet, KeyboardAvoidingView, Pressable, Animated, TouchableOpacity, Image, ScrollView, Dimensions, TextInput } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';


const { height } = Dimensions.get('window');
const marginHeight = (height - 500) / 2;


const EditProfileView = ({ onClose }) => {
    
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


    const confirmEdits = async () => {
        await updateProfile();

        if (draftPfpUri) {
            const payload = { imageUri: draftPfpUri };
            await AsyncStorage.setItem(PFP_KEY, JSON.stringify(payload));
            setSavedPfpUri(draftPfpUri);
            setDraftPfpUri(null);
        }

        close();
    };




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
            })
        ]).start();
    }, []);

    const close = () => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(sheetTranslateY, {
                toValue: 600,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => {onClose()});
    };



    return (
        <View style={styles.screen}>
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <Pressable style={{ flex: 1 }} onPress={close}/>
            </Animated.View>
            
            <Animated.View style={{ transform: [{ translateY: sheetTranslateY }]}}>
                <KeyboardAvoidingView behavior={'padding'}>
                    <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
                        <View style={[styles.mainBox, { marginTop: marginHeight }]}>
                            <View style={styles.headerBar}>
                                <TouchableOpacity onPress={close}>
                                    <Feather name="x" size={40} color="#4A6080" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={confirmEdits}>
                                    <Text style={[{ color: '#4A6080', fontSize: 20, fontWeight: 'bold'}]}>Save</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={pickImage} style={[{marginBottom: 30}]}>
                                {displayedPfpUri 
                                    ? <Image source={{ uri: displayedPfpUri }} style={styles.pfp} />
                                    : <MaterialCommunityIcons name="emoticon-cool-outline" size={110} color="#4A6080" style={styles.pfp} />
                                }

                                <MaterialCommunityIcons style={[styles.pencilDetail, { zIndex: 2 }]} name="pencil-box" size={43} color="#4A6080" />
                                <View style={[{ position: 'absolute', right: 7, top: 7, width: 25, height: 25, backgroundColor: 'white', zIndex: 1,}]}/>
                            </TouchableOpacity>


                            <Text style={styles.displayNameTitle}>Display Name</Text>
                            <TextInput style={[styles.textInputStyle, { marginBottom: 20, height: 40 }]}
                                placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                                autoCorrect={false}
                                autoCapitalize='false' 
                                onChangeText={text => {setUsername(text)}}/>

                            <Text style={styles.displayNameTitle}>Bio</Text>
                            <TextInput style={[styles.textInputStyle, { height: 135 }]}
                                placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                                autoCorrect={false}
                                autoCapitalize='false'
                                numberOfLines={6}
                                multiline
                                onChangeText={text => {setBio(text)}}/>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Animated.View>
        </View>
    )
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    mainBox: {
        backgroundColor: '#F4F7FA',
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: 320,
    },

    pfp: {
        width: 120,
        height: 120,

        borderRadius: 200,
        backgroundColor: '#D0DAE8',
        borderWidth: 5,
        borderColor: '#4A6080'
    },

    displayNameTitle: {
        alignSelf: 'flex-start',
        fontSize: 15,
        color: '#4A6080',
    },

    textInputStyle: {
        width: 270,
        fontSize: 16,

        padding: 10,

        backgroundColor: '#D0DAE8',
        borderRadius: 15,
        margin: 5,

        color: '#4A6080',
    },

    headerBar: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        top: 20,
    },

    pencilDetail: {
        position: 'absolute',
        right: 0,
    },
});

export default EditProfileView;