import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from 'react';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';


import AntDesign from '@expo/vector-icons/AntDesign';

const SignUpPage = () => {

    const navigation = useNavigation();

    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password).then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with:', user.email);
            navigation.replace('login');
        })
        .catch(error => alert(error.message))};


    return (


        <KeyboardAvoidingView style={styles.container} behavior='padding'> 
            <View style={[{ flexDirection: 'row', marginBottom: 20, }]}>
                    <Text style={[{ fontSize: 60 }]}>InnerHue </Text>
                    <AntDesign name="aliwangwang" size={70} color="black" />
                </View>
            
                <View style={[{ backgroundColor: 'rgba(0,0,0,0.5)', height: 3, width: 350, borderRadius: 3, marginBottom: 50}]}/>
            
                <View style={[{ alignSelf: 'flex-start', marginLeft: 80, marginBottom: 5 }]}>
                    <Text>Enjoy Your Stay!</Text>
                </View>
            
                <TextInput style={styles.textInputStyle} placeholder='Name' placeholderTextColor='rgba(0,0,0,0.5)' autoCorrect={false}/>
                <TextInput style={styles.textInputStyle} 
                    placeholder='Email' 
                    placeholderTextColor='rgba(0,0,0,0.5)' 
                    autoCorrect={false} 
                    onChangeText={text => {setEmail(text)}} 
                    autoCapitalize='false'/>

                <TextInput style={styles.textInputStyle} 
                    placeholder='Password' 
                    placeholderTextColor='rgba(0,0,0,0.5)' 
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
                        <Text style={[{ color: "#rgba(0,0,0,0.5)", textDecorationLine: 'underline' }]}>Login Here!</Text>
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

        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
        margin: 5,
    },

    loginButton: {
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.35)',
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',

        color: 'rgba(0,0,0,0.6)',

        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SignUpPage;