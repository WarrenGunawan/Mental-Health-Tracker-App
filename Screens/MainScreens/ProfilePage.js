import { Text, View, Image, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/core';

import TopBar from '../../Components/TopBar';
import ProfileView from '../../Components/ProfileView';
import EditableProfileView from '../../Components/EditableProfileView';




const ProfilePage = () => {

    const route = useRoute();
    const mode = route.params?.mode ?? 'view';


    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            <TopBar />
            <LinearGradient colors={['#FFFFFF', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }} style={{ height: 5, width: '100%' }} />

            {mode === 'edit' ? <EditableProfileView /> : <ProfileView />}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
})

export default ProfilePage;