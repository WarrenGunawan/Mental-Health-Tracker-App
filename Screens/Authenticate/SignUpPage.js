import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from 'react';

import { doc, setDoc, getDoc} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from '../../firebase';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SignUpPage = () => {

    const navigation = useNavigation();

    const [ name, setName ] = useState();
    const [ username, setUsername ] = useState();
    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();

    const bio = 'No Bio.';

    const createUser = async (user) => {
        await setDoc(doc(db, 'users', user.uid), {
            name, 
            username,
            email,
            bio,
        }) 
    }

    const handleSignUp = async () => {
        createUserWithEmailAndPassword(auth, email, password).then(userCredentials => {
            const user = userCredentials.user;
            console.log('Signed in with:', user.email);

            createUser(user);
        })
        .catch(err => alert(err.message))};

    return (


        <KeyboardAvoidingView style={styles.container} behavior='padding'> 
            <View style={[{ flexDirection: 'row', marginBottom: 20, }]}>
                    <Text style={[{ fontSize: 60, color: '#4A6080' }]}>InnerHue </Text>
                    <MaterialCommunityIcons name="bread-slice-outline" size={70} color="#4A6080" />
                </View>
            
                <View style={[{ backgroundColor: '#4A6080', height: 3, width: 350, borderRadius: 3, marginBottom: 50}]}/>
            
                <View style={[{ alignSelf: 'flex-start', marginLeft: 80, marginBottom: 5 }]}>
                    <Text style={{ color: '#4A6080'}}>Enjoy Your Stay!</Text>
                </View>
            
                <TextInput style={styles.textInputStyle} 
                    placeholder='Name' 
                    placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                    onChangeText={text => {setName(text)}} 
                    autoCorrect={false}
                    autoCapitalize='true'/>
                <TextInput style={styles.textInputStyle} 
                    placeholder='Username' 
                    placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                    onChangeText={text => {setUsername(text)}} 
                    autoCorrect={false}
                    autoCapitalize='false'/>
                <TextInput style={styles.textInputStyle} 
                    placeholder='Email' 
                    placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                    autoCorrect={false} 
                    onChangeText={text => {setEmail(text)}} 
                    autoCapitalize='false'/>

                <TextInput style={styles.textInputStyle} 
                    placeholder='Password' 
                    placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                    autoCorrect={false} 
                    onChangeText={text => {setPassword(text)}} 
                    autoCapitalize='false'
                    secureTextEntry/>
            
            
                <View style={[{ backgroundColor: 'rgba(0,0,0,0.5)', height: 3, width: 350, borderRadius: 3, marginTop: 50 }]}/>
            
            
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={[styles.loginButton, { marginTop: 30, padding: 15, fontSize: 20, fontWeight: 'bold', paddingHorizontal: 110 }]}>Sign Up</Text>
                </TouchableOpacity>

                <View style={[{ flexDirection: 'row', margin: 10 }]}>
                    <TouchableOpacity onPress={() => navigation.replace('login')}>
                        <Text style={[{ color: '#4A6080', textDecorationLine: 'underline' }]}>Login Here!</Text>
                    </TouchableOpacity>
                </View>
            
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
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

    input: {
        padding: 5,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'green',
        margin: 5,
    },

    textInputStyle: {
        width: 250,
        height: 40,
        fontSize: 16,

        padding: 10,

        backgroundColor: '#D0DAE8',
        borderRadius: 15,
        margin: 5,

        color: '#4A6080'
    },

    loginButton: {
        borderRadius: 20,
        backgroundColor: '#D0DAE8',

        color: '#4A6080',

        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SignUpPage;