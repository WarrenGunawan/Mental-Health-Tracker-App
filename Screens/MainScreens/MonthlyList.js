// ✅ Copy/paste this whole file (it’s your current version + the “no months before join” logic)

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect, useMemo } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase.js';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TopBar from '../../Components/TopBar';

const MonthlyList = () => {
    const user = auth.currentUser;
    const uid = user?.uid;

    const [monthCursor, setMonthCursor] = useState(() => {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    });

    const joinMonthStart = useMemo(() => {
        const creationTime = user?.metadata?.creationTime; 
        const joinDate = creationTime ? new Date(creationTime) : new Date();
        return new Date(joinDate.getFullYear(), joinDate.getMonth(), 1);
    }, [user]);

    const canGoPrev = useMemo(() => {
        return monthCursor.getTime() > joinMonthStart.getTime();
    }, [monthCursor, joinMonthStart]);

    const moodOptions = [
        { id: 1, color: '#36CEDC', value: 1 },
        { id: 2, color: '#FFEA56', value: 3 },
        { id: 3, color: '#FE797B', value: 5 },
        { id: 4, color: '#8FE968', value: 2 },
        { id: 5, color: '#FFB750', value: 4 },
    ];

    const colorForMood = (mood) => {
        const m = Number(mood);
        return (
        moodOptions.find(o => o.value === m)?.color ||
        moodOptions.find(o => o.id === m)?.color ||
        'white'
        );
    };

    const toDateKey = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const monthStartKey = useMemo(() => {
        const start = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        return toDateKey(start);
    }, [monthCursor]);

    const nextMonthStartKey = useMemo(() => {
        const next = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
        next.setHours(0, 0, 0, 0);
        return toDateKey(next);
    }, [monthCursor]);

    const [monthMoodMap, setMonthMoodMap] = useState(() => new Map());

    useEffect(() => {
        if (!uid) return;

        const q = query(
        collection(db, 'users', uid, 'entries'),
        where('dateKey', '>=', monthStartKey),
        where('dateKey', '<', nextMonthStartKey),
        orderBy('dateKey', 'asc')
        );

        const unsub = onSnapshot(q, (snap) => {
        const map = new Map();
        snap.forEach((docSnap) => {
            const data = docSnap.data();
            const key = data?.dateKey ?? docSnap.id;
            map.set(key, data?.mood ?? null);
        });
        setMonthMoodMap(map);
        });

        return unsub;
    }, [uid, monthStartKey, nextMonthStartKey]);

    const monthSlots = useMemo(() => {
        const year = monthCursor.getFullYear();
        const month = monthCursor.getMonth();

        const firstOfMonth = new Date(year, month, 1);
        firstOfMonth.setHours(0, 0, 0, 0);

        const startDay = firstOfMonth.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        return Array.from({ length: 42 }, (_, i) => {
        const dayOffset = i - startDay;
        const inMonth = dayOffset >= 0 && dayOffset < daysInMonth;

        if (!inMonth) {
            return { key: `blank-${i}`, inMonth: false, mood: null };
        }

        const d = new Date(year, month, 1 + dayOffset);
        const dateKey = toDateKey(d);
        return {
            key: dateKey,
            inMonth: true,
            dateKey,
            mood: monthMoodMap.get(dateKey) ?? null,
        };
        });
    }, [monthCursor, monthMoodMap]);

    const monthTitle = useMemo(() => {
        const m = monthCursor.toLocaleString('default', { month: 'long' });
        const y = monthCursor.getFullYear();
        return `${m} ${y}`;
    }, [monthCursor]);

    const goPrevMonth = () => {
        if (!canGoPrev) return;
        setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goNextMonth = () => {
        setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const rows = useMemo(() => {
        const r = [];
        for (let i = 0; i < 6; i++) r.push(monthSlots.slice(i * 7, (i + 1) * 7));
        return r;
    }, [monthSlots]);

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            <TopBar />
            <LinearGradient
                colors={['#FFFFFF', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.04 }}
                style={{ height: 5, width: '100%' }}
            />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                bounces>

                <Text style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 10 }}>
                Calendar
                </Text>

                <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.calendarContainer}>
                        <View style={styles.monthHeader}>

                        {canGoPrev ? (
                            <TouchableOpacity onPress={goPrevMonth} style={styles.navBtn}>
                            <FontAwesome6 name="chevron-left" size={18} color="#666666" />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.navBtn} />
                        )}

                        <Text style={styles.monthTitle}>{monthTitle}</Text>

                        <TouchableOpacity onPress={goNextMonth} style={styles.navBtn}>
                            <FontAwesome6 name="chevron-right" size={18} color="#666666" />
                        </TouchableOpacity>
                        </View>

                        <View style={styles.weekLabelsRow}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <Text key={i} style={styles.weekLabel}>{d}</Text>
                        ))}
                        </View>

                        <View style={{ width: '100%', marginTop: 10 }}>
                        {rows.map((row, rowIdx) => (
                            <View key={rowIdx} style={styles.weekRow}>
                            {row.map((slot) => {
                                if (!slot.inMonth) {
                                return <View key={slot.key} style={[styles.weekSlot, styles.blankSlot]} />;
                                }

                                const bg = slot.mood ? colorForMood(slot.mood) : 'white';
                                return (
                                <View
                                    key={slot.key}
                                    style={[
                                    styles.weekSlot,
                                    { backgroundColor: bg },
                                    ]}
                                />
                                );
                            })}
                            </View>
                        ))}
                        </View>

                        {monthMoodMap.size === 0 ? (
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <FontAwesome6 name="face-sad-tear" size={24} color="#666666" />
                                <Text style={{ marginLeft: 10, color: '#666666', fontSize: 20 }}>Entries to be added...</Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <FontAwesome6 name="face-smile-beam" size={24} color="#666666" />
                                <Text style={{ marginLeft: 10, color: '#666666', fontSize: 20 }}>Thank you for your Entries!</Text>
                            </View>
                        )}
                    </View>
                </View>
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
    marginBottom: 20,
},

monthHeader: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},

monthTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666666',
},

navBtn: {
    padding: 10,
    width: 38, 
    alignItems: 'center',
},

weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    marginTop: 12,
},

weekSlot: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.2)',
},

blankSlot: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
},

weekLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    marginTop: 12,
},

weekLabel: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
},

calendarContainer: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    width: '97%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 20,
},
});

export default MonthlyList;
