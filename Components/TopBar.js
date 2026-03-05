import { Text, View, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';

import Options from './Options';
import { useState, useEffect, useRef } from 'react';

import { collection, onSnapshot, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.js';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';



function TopBar() {

    const [ selectedOptions, setSelectedOptions ] = useState(false);
    const [ inboxOpen, setInboxOpen ] = useState(false);
    const [ incomingRequests, setIncomingRequests ] = useState([]);

    const uid = auth.currentUser?.uid;

    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const sheetTranslateY = useRef(new Animated.Value(400)).current;

    useEffect(() => {
        if (!uid) return;
        const unsub = onSnapshot(collection(db, 'users', uid, 'friendRequests'), (snap) => {
            setIncomingRequests(snap.docs.map(d => d.id));
        });
        return unsub;
    }, [uid]);

    const openInbox = () => {
        setInboxOpen(true);
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
    };

    const closeInbox = () => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(sheetTranslateY, {
                toValue: 400,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => setInboxOpen(false));
    };

    return (
        <>
            <View style={{ position: 'absolute', top: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                <Text style={{ fontSize: 20, color: '#4A6080' }}>InnerHue </Text>
                <MaterialCommunityIcons name='bread-slice-outline' size={20} color='#4A6080' />
            </View>

            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.inboxBtn} onPress={openInbox}>
                    <MaterialCommunityIcons name='bell-outline' size={22} color='#4A6080' />
                    {incomingRequests.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{incomingRequests.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setSelectedOptions(true)}>
                    <Text style={{ fontSize: 15, marginBottom: 1, color: '#4A6080' }}>Options </Text>
                    <Octicons name='gear' size={18} color='#4A6080'/>
                </TouchableOpacity>
            </View>

            {/* Options modal */}
            <Modal
                visible={selectedOptions}
                transparent
                animationType='fade'>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }}>
                    <Options onClose={() => setSelectedOptions(false)} />
                </View>
            </Modal>

            {/* Inbox — animationType='none' so we control both animations ourselves */}
            <Modal
                visible={inboxOpen}
                transparent
                animationType='none'
                onRequestClose={closeInbox}>

                {/* Backdrop fades in independently */}
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={closeInbox} activeOpacity={1} />
                </Animated.View>

                {/* Sheet slides up independently */}
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
                    <InboxModal
                        uid={uid}
                        incomingRequests={incomingRequests}
                        onClose={closeInbox} />
                </Animated.View>

            </Modal>
        </>
    );
}


// ─── Inbox Sheet Content ──────────────────────────────────────────────────────

function InboxModal({ uid, incomingRequests, onClose }) {
    const [requestProfiles, setRequestProfiles] = useState([]);

    useEffect(() => {
        const load = async () => {
            const profiles = await Promise.all(
                incomingRequests.map(async (senderUid) => {
                    const snap = await getDoc(doc(db, 'users', senderUid));
                    const username = snap.exists() ? (snap.data().username ?? 'Unknown') : 'Unknown';
                    return { uid: senderUid, username };
                })
            );
            setRequestProfiles(profiles);
        };
        load();
    }, [incomingRequests]);

    const acceptRequest = async (senderUid) => {
        try {
            await setDoc(doc(db, 'users', uid, 'friends', senderUid), { since: new Date().toISOString() });
            await setDoc(doc(db, 'users', senderUid, 'friends', uid), { since: new Date().toISOString() });
            await deleteDoc(doc(db, 'users', uid, 'friendRequests', senderUid));
        } catch (e) {
            console.log('Failed to accept request:', e);
        }
    };

    const declineRequest = async (senderUid) => {
        try {
            await deleteDoc(doc(db, 'users', uid, 'friendRequests', senderUid));
        } catch (e) {
            console.log('Failed to decline request:', e);
        }
    };

    return (
        <View style={modalStyles.container}>
            {/* Drag handle */}
            <View style={modalStyles.handle} />

            <View style={modalStyles.header}>
                <Text style={modalStyles.title}>Friend Requests</Text>
                <TouchableOpacity onPress={onClose}>
                    <MaterialCommunityIcons name='close' size={24} color='#4A6080' />
                </TouchableOpacity>
            </View>

            {requestProfiles.length === 0 ? (
                <View style={modalStyles.emptyState}>
                    <FontAwesome6 name='face-smile-beam' size={20} color='#4A6080' />
                    <Text style={modalStyles.emptyText}>No pending requests</Text>
                </View>
            ) : (
                requestProfiles.map((req) => (
                    <View key={req.uid} style={modalStyles.requestRow}>
                        <View style={modalStyles.avatar}>
                            <MaterialCommunityIcons name='emoticon-cool-outline' size={20} color='#4A6080' />
                        </View>
                        <Text style={modalStyles.username}>{req.username}</Text>
                        <View style={modalStyles.actions}>
                            <TouchableOpacity
                                style={[modalStyles.actionBtn, modalStyles.acceptBtn]}
                                onPress={() => acceptRequest(req.uid)}>
                                <Text style={modalStyles.actionBtnText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.actionBtn, modalStyles.declineBtn]}
                                onPress={() => declineRequest(req.uid)}>
                                <Text style={modalStyles.actionBtnText}>Decline</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: '#F4F7FA',
        zIndex: -1,
    },

    inboxBtn: {
        padding: 4,
        position: 'relative',
    },

    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FE797B',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },

    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

const modalStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        minHeight: 300,
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D0DAE8',
        alignSelf: 'center',
        marginBottom: 16,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A6080',
    },

    emptyState: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },

    emptyText: {
        marginLeft: 10,
        color: '#4A6080',
        fontSize: 18,
    },

    requestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E9F1',
        borderRadius: 15,
        padding: 12,
        marginBottom: 10,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#D0DAE8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    username: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A6080',
    },

    actions: {
        flexDirection: 'row',
        gap: 8,
    },

    actionBtn: {
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 14,
    },

    acceptBtn: {
        backgroundColor: '#8FE968',
    },

    declineBtn: {
        backgroundColor: '#D0DAE8',
    },

    actionBtnText: {
        color: '#4A6080',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default TopBar;