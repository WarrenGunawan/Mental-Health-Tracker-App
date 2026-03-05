import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator
} from 'react-native';
import { useState, useEffect } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import {
    collection, query, where, getDocs, doc, setDoc,
    onSnapshot, getDoc, orderBy
} from 'firebase/firestore';
import { db, auth } from '../../firebase.js';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TopBar from '../../Components/TopBar';


// ─── Helpers ─────────────────────────────────────────────────────────────────

const toDateKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const startOfWeekSunday = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
};

const getWeekKeys = () => {
    const start = startOfWeekSunday();
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return toDateKey(d);
    });
};

const moodOptions = [
    { value: 1, color: '#36CEDC' },
    { value: 2, color: '#8FE968' },
    { value: 3, color: '#FFEA56' },
    { value: 4, color: '#FFB750' },
    { value: 5, color: '#FE797B' },
];

const colorForMood = (mood) => {
    const m = Number(mood);
    return moodOptions.find(o => o.value === m)?.color ?? '#D0DAE8';
};


// ─── Friend Week Widget ───────────────────────────────────────────────────────

const FriendWidget = ({ friendUid, username }) => {
    const [weekSlots, setWeekSlots] = useState(
        getWeekKeys().map(dateKey => ({ dateKey, mood: null }))
    );

    useEffect(() => {
        const weekKeys = getWeekKeys();
        const weekStart = weekKeys[0];
        const nextWeekStart = (() => {
            const start = startOfWeekSunday();
            const next = new Date(start);
            next.setDate(start.getDate() + 7);
            return toDateKey(next);
        })();

        const q = query(
            collection(db, 'users', friendUid, 'entries'),
            where('dateKey', '>=', weekStart),
            where('dateKey', '<', nextWeekStart),
            orderBy('dateKey', 'asc')
        );

        const unsub = onSnapshot(q, (snap) => {
            const map = new Map();
            snap.forEach(docSnap => {
                const data = docSnap.data();
                map.set(data?.dateKey ?? docSnap.id, data?.mood ?? null);
            });
            setWeekSlots(weekKeys.map(k => ({ dateKey: k, mood: map.get(k) ?? null })));
        }, (error) => {
            console.log('Widget permission error (likely transient):', error.code);
        });

        return unsub;
    }, [friendUid]);

    return (
        <View style={styles.friendWidget}>
            <View style={styles.friendWidgetHeader}>
                <View style={styles.friendAvatar}>
                    <MaterialCommunityIcons name="emoticon-cool-outline" size={22} color="#4A6080" />
                </View>
                <Text style={styles.friendWidgetName}>{username}</Text>
                <Text style={styles.friendWidgetSubtitle}>This week</Text>
            </View>

            <View style={styles.weekRow}>
                {weekSlots.map((slot) => (
                    <View
                        key={slot.dateKey}
                        style={[
                            styles.weekSlot,
                            { backgroundColor: slot.mood ? colorForMood(slot.mood) : '#D0DAE8' },
                        ]}
                    />
                ))}
            </View>

            <View style={styles.weekLabelsRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <Text key={i} style={styles.weekLabel}>{d}</Text>
                ))}
            </View>
        </View>
    );
};


// ─── Main Page ────────────────────────────────────────────────────────────────

const FriendsPage = () => {
    const user = auth.currentUser;
    const uid = user?.uid;

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const [friends, setFriends] = useState([]);
    const [sentRequests, setSentRequests] = useState(new Set());


    // ── Listen to confirmed friends ──────────────────────────────────────────
    useEffect(() => {
        if (!uid) return;
        const unsub = onSnapshot(collection(db, 'users', uid, 'friends'), async (snap) => {
            const list = await Promise.all(
                snap.docs.map(async (d) => {
                    const friendUid = d.id;
                    const profileSnap = await getDoc(doc(db, 'users', friendUid));
                    const username = profileSnap.exists()
                        ? (profileSnap.data().username ?? 'Unknown')
                        : 'Unknown';
                    return { uid: friendUid, username };
                })
            );
            setFriends(list);
        });
        return unsub;
    }, [uid]);


    // ── Track sent requests for current search results ───────────────────────
    useEffect(() => {
        if (!uid || searchResults.length === 0) return;

        const checkSent = async () => {
            const set = new Set();
            await Promise.all(searchResults.map(async (r) => {
                const snap = await getDoc(doc(db, 'users', r.uid, 'friendRequests', uid));
                if (snap.exists()) set.add(r.uid);
            }));
            setSentRequests(set);
        };

        checkSent();
    }, [searchResults, uid]);


    // ── Search users by username ─────────────────────────────────────────────
    const handleSearch = async () => {
        const trimmed = searchText.trim();
        if (!trimmed) return;

        setSearching(true);
        setSearchError('');
        setSearchResults([]);
        setHasSearched(true);

        try {
            const q = query(
                collection(db, 'users'),
                where('username', '>=', trimmed),
                where('username', '<=', trimmed + '\uf8ff')
            );
            const snap = await getDocs(q);
            const results = snap.docs
                .map(d => ({ uid: d.id, username: d.data().username, name: d.data().name ?? '' }))
                .filter(r => r.uid !== uid);

            if (results.length === 0) setSearchError('No users found.');
            setSearchResults(results);
        } catch (e) {
            console.log('Search error:', e);
            setSearchError('Something went wrong. Try again.');
        }

        setSearching(false);
    };


    // ── Clear search — collapse results, show widgets again ──────────────────
    const clearSearch = () => {
        setSearchText('');
        setSearchResults([]);
        setSearchError('');
        setHasSearched(false);
    };


    // ── Send friend request ──────────────────────────────────────────────────
    const sendFriendRequest = async (targetUid) => {
        if (!uid) return;
        try {
            await setDoc(doc(db, 'users', targetUid, 'friendRequests', uid), {
                from: uid,
                sentAt: new Date().toISOString(),
            });
            setSentRequests(prev => new Set([...prev, targetUid]));
        } catch (e) {
            console.log('Failed to send request:', e);
        }
    };

    const friendUids = new Set(friends.map(f => f.uid));


    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            <TopBar />
            <LinearGradient
                colors={['#FFFFFF', 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.04 }}
                style={{ height: 5, width: '100%' }}
            />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                bounces
                showsVerticalScrollIndicator={false}>

                {/* ── Page title ── */}
                <View style={styles.headerRow}>
                    <Text style={styles.pageTitle}>Friends</Text>
                </View>

                {/* ── Search bar ── */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by username..."
                        placeholderTextColor="rgba(74, 96, 128, 0.4)"
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSearch}
                        autoCorrect={false}
                        autoCapitalize="none"
                        returnKeyType="search"
                    />
                    {/* Toggles between X (clear) and search icon */}
                    {hasSearched ? (
                        <TouchableOpacity style={styles.searchButton} onPress={clearSearch}>
                            <MaterialCommunityIcons name="close" size={20} color="#4A6080" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            {searching
                                ? <ActivityIndicator size="small" color="#4A6080" />
                                : <FontAwesome6 name="magnifying-glass" size={18} color="#4A6080" />
                            }
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Search results — only visible after a search ── */}
                {hasSearched && (
                    <>
                        {searchError !== '' && (
                            <Text style={styles.searchError}>{searchError}</Text>
                        )}

                        {searchResults.map((result) => {
                            const isFriend = friendUids.has(result.uid);
                            const isPending = sentRequests.has(result.uid);

                            return (
                                <View key={result.uid} style={styles.searchResultRow}>
                                    <View style={styles.resultAvatar}>
                                        <MaterialCommunityIcons name="emoticon-cool-outline" size={20} color="#4A6080" />
                                    </View>
                                    <View style={styles.resultInfo}>
                                        <Text style={styles.resultUsername}>{result.username}</Text>
                                        {result.name !== '' && (
                                            <Text style={styles.resultName}>{result.name}</Text>
                                        )}
                                    </View>
                                    {isFriend ? (
                                        <View style={[styles.requestBtn, styles.requestBtnDisabled]}>
                                            <Text style={styles.requestBtnText}>Friends</Text>
                                        </View>
                                    ) : isPending ? (
                                        <View style={[styles.requestBtn, styles.requestBtnDisabled]}>
                                            <Text style={styles.requestBtnText}>Pending</Text>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.requestBtn}
                                            onPress={() => sendFriendRequest(result.uid)}>
                                            <Text style={styles.requestBtnText}>Add</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })}
                    </>
                )}

                {/* ── Friend widgets — hidden while search is active ── */}
                {!hasSearched && (
                    friends.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome6 name="face-sad-tear" size={20} color="#4A6080" />
                            <Text style={styles.emptyText}>No friends added yet...</Text>
                        </View>
                    ) : (
                        friends.map((friend) => (
                            <FriendWidget
                                key={friend.uid}
                                friendUid={friend.uid}
                                username={friend.username}
                            />
                        ))
                    )
                )}

            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },

    scrollContainer: {
        flex: 1,
        width: '100%',
    },

    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 30,
    },

    headerRow: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    pageTitle: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#4A6080',
    },

    searchContainer: {
        flexDirection: 'row',
        width: '90%',
        backgroundColor: '#E0E9F1',
        borderRadius: 15,
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 12,
    },

    searchInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#4A6080',
    },

    searchButton: {
        padding: 8,
    },

    searchError: {
        color: '#4A6080',
        opacity: 0.6,
        marginBottom: 10,
        fontSize: 14,
    },

    searchResultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#E0E9F1',
        borderRadius: 15,
        padding: 12,
        marginBottom: 8,
    },

    resultAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#D0DAE8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    resultInfo: {
        flex: 1,
    },

    resultUsername: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A6080',
    },

    resultName: {
        fontSize: 13,
        color: '#4A6080',
        opacity: 0.6,
    },

    requestBtn: {
        backgroundColor: '#D0DAE8',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },

    requestBtnDisabled: {
        opacity: 0.5,
    },

    requestBtnText: {
        color: '#4A6080',
        fontWeight: 'bold',
        fontSize: 14,
    },

    friendWidget: {
        width: '90%',
        backgroundColor: '#E0E9F1',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
    },

    friendWidgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    friendAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#D0DAE8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    friendWidgetName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A6080',
        flex: 1,
    },

    friendWidgetSubtitle: {
        fontSize: 12,
        color: '#4A6080',
        opacity: 0.5,
    },

    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',
    },

    weekSlot: {
        width: 38,
        height: 38,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'rgba(74, 96, 128, 0.2)',
    },

    weekLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',
        marginTop: 6,
    },

    weekLabel: {
        width: 38,
        textAlign: 'center',
        fontSize: 12,
        color: '#4A6080',
        opacity: 0.6,
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
});

export default FriendsPage;