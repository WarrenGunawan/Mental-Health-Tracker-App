import { Text, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TopBar from '../../Components/TopBar';


const ProfilePage = () => {


    return (
        <SafeAreaView style={styles.container}>
            <TopBar />
            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />


            <View style={styles.profileContainer}>
                <Text>Profile</Text>
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
        justifyContent: 'center',

        marginTop: 35,
        width: '80%',

        backgroundColor: 'rgba(0,0,0,0.1)',

        borderRadius: 40,
    },
})

export default ProfilePage;