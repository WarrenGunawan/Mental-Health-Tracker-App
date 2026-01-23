import { Text, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TopBar from '../../Components/TopBar';

import Wooper from '../../assets/images/wooper.png';



const ProfilePage = () => {


    return (
        <SafeAreaView style={styles.container}>
            <TopBar />
            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />


            <View style={styles.profileContainer}>
                <Image source={Wooper} style={styles.pfp}/>
                <Text style={styles.username}>Super Funny Username</Text>
                <Text style={styles.name}>Warren Gunawan</Text>
                <View style={styles.informationContainer}> 
                    <Text style={styles.aboutMeTitle}>About Me!</Text>
                    <View>
                        <Text style={styles.aboutMe}>Placeholder text, this is all about me. </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

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
    },

    name: {
        fontSize: 15,
        color: '#666666'
    },

    informationContainer: {
        flex: 1,
        justifyContent: 'center',

        backgroundColor: '#BBBBBB',
        borderRadius: 20,

        marginTop: 10,
        
        width: '80%',
        marginBottom: 30,
    },

    aboutMeTitle: {
        fontSize: 15,
        padding: 20,

        color: '#666666'
    },

    aboutMe: {
        fontSize: 15,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
})

export default ProfilePage;