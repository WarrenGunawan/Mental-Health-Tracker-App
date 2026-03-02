import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { db, auth } from '../../firebase.js';

import TopBar from '../../Components/TopBar';


const FriendsPage = () => {

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            <TopBar />
            
            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    }
})

export default FriendsPage;