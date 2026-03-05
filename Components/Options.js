import { StyleSheet, Text, TouchableOpacity, View, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useEffect, useRef } from 'react';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

import Octicons from '@expo/vector-icons/Octicons';


function Options({ onClose }) {
    const navigation = useNavigation();

    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const panelTranslateY = useRef(new Animated.Value(400)).current;

    // Animate in on mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(panelTranslateY, {
                toValue: 0,
                damping: 20,
                stiffness: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const close = (callback) => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(panelTranslateY, {
                toValue: 400,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
            if (callback) callback();
        });
    };

    const handleSignOut = async () => {
        close(async () => {
            try {
                await signOut(auth);
            } catch (e) {
                alert(e.message);
            }
        });
    };


    return (
        <View style={styles.overlay}>
            {/* Fading backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <Pressable style={{ flex: 1 }} onPress={() => close()} />
            </Animated.View>

            {/* Sliding panel */}
            <Animated.View style={[styles.panelWrapper, { transform: [{ translateY: panelTranslateY }] }]}>
                <View style={styles.handle} />

                <View style={styles.panel}>
                    <Octicons name='gear' size={35} color='#4A6080' style={{ paddingBottom: 10 }} />

                    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    panelWrapper: {
        backgroundColor: '#F4F7FA',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 12,
        paddingBottom: 40,
        alignItems: 'center',
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#C0CEDC',
        alignSelf: 'center',
        marginBottom: 16,
    },

    panel: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 15,
        backgroundColor: '#D0DAE8',
        width: '50%',
        paddingVertical: 15,

        marginVertical: 5,
    },

    buttonText: {
        color: '#4A6080',
        fontWeight: '600',
    },
});

export default Options;