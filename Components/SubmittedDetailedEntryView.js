import { StyleSheet, Text, View, TouchableOpacity, Pressable, Animated } from 'react-native';
import { useEffect, useRef } from 'react';



function SubmittedDetailedEntryView({ onClose, formattedDate, moodOptions, mood, notes }) {

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
            }),
        ]).start();
    }, []);

    const close = () => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(sheetTranslateY, {
                toValue: 600,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    const moodColor = moodOptions.find(o => o.value === mood)?.color ?? '#D0DAE8';


    return (
        <View style={styles.screen}>
            {/* Fading backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <Pressable style={{ flex: 1 }} onPress={close} />
            </Animated.View>

            {/* Sliding content */}
            <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
                <View style={styles.card}>
                    <Text style={styles.title}>{formattedDate} Entry</Text>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Today's Mood</Text>
                    <View style={[styles.moodSwatch, { backgroundColor: moodColor }]} />

                    <Text style={styles.label}>Notes</Text>
                    <View style={styles.notesBox}>
                        <Text style={styles.notesText}>
                            {notes && notes.trim() !== '' ? notes : 'No notes written for today.'}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={close}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
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

    card: {
        backgroundColor: '#F4F7FA',
        padding: 30,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: 320,
    },

    title: {
        fontSize: 38,
        marginBottom: 20,
        color: '#4A6080',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    divider: {
        height: 3,
        width: 260,
        borderRadius: 3,
        marginBottom: 20,
        backgroundColor: '#4A6080',
    },

    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#4A6080',
        marginBottom: 10,
    },

    moodSwatch: {
        width: 60,
        height: 60,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.15)',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },

    notesBox: {
        backgroundColor: '#D0DAE8',
        borderRadius: 15,
        padding: 14,
        width: '100%',
        minHeight: 80,
        marginBottom: 24,
    },

    notesText: {
        fontSize: 16,
        color: '#4A6080',
    },

    closeButton: {
        borderRadius: 20,
        backgroundColor: '#D0DAE8',
        color: '#4A6080',
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 15,
        paddingHorizontal: 50,
    },
});


export default SubmittedDetailedEntryView;