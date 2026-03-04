import { StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from 'react';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



const LoginPage = () => {

    const navigation = useNavigation();

    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password).then(userCredentials => {
            const user = userCredentials.user;
            console.log('Signed in with:', user.email);
        })
        .catch(error => alert(error.message))};


    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'> 
            <View style={[{ flexDirection: 'row', marginBottom: 20, }]}>
                <Text style={[{ fontSize: 60, color: '#4A6080' }]}>InnerHue </Text>
                <MaterialCommunityIcons name="bread-slice-outline" size={70} color="#4A6080" />
            </View>

            <View style={[{ backgroundColor: '#4A6080', height: 3, width: 350, borderRadius: 3, marginBottom: 50}]}/>

            <View style={[{ alignSelf: 'flex-start', marginLeft: 80, marginBottom: 5 }]}>
                <Text style={{ color: '#4A6080' }}>Welcome Friend!</Text>
            </View>

            <TextInput style={styles.textInputStyle} 
                placeholder='Email' 
                placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                autoCorrect={false}
                onChangeText={text => setEmail(text)}
                autoCapitalize='false'/>
            <TextInput style={styles.textInputStyle} 
                placeholder='Password' 
                placeholderTextColor='rgba(74, 96, 128, 0.4)' 
                autoCorrect={false}
                onChangeText={text => setPassword(text)}
                autoCapitalize='false'
                secureTextEntry/>


            <View style={[{ backgroundColor: '#4A6080', height: 3, width: 350, borderRadius: 3, marginTop: 50 }]}/>


            <TouchableOpacity onPress={handleSignIn}>
                <Text style={[styles.loginButton, { marginTop: 30, padding: 15, fontSize: 20, fontWeight: 'bold', paddingHorizontal: 120 }]}>Login</Text>
            </TouchableOpacity>


            <View style={[{ flexDirection: 'row', margin: 10 }]}>
                <Text style={{ color: '#4A6080' }}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.replace('signup')}>
                    <Text style={[{ color: '#4A6080', textDecorationLine: 'underline' }]}>Register now!</Text>
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

        color: '#4A6080',
    },

    loginButton: {
        borderRadius: 20,
        backgroundColor: '#D0DAE8',

        color: '#4A6080',

        justifyContent: 'center',
        alignItems: 'center',
    },
})


export default LoginPage;

