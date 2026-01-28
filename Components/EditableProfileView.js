import { View, Text, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

import Wooper from '../assets/images/wooper.png';


const EditableProfileView = () => {
    


    return (
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

        width: '80%',

        marginTop: 10,
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


export default EditableProfileView;