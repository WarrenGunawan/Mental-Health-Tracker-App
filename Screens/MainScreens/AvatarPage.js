import { StyleSheet, Text, TouchableOpacity, View,  } from "react-native";
import { useState } from 'react';
import { useNavigation } from "@react-navigation/core";

import { LinearGradient } from 'expo-linear-gradient';

import Entypo from '@expo/vector-icons/Entypo';

const AvatarPage = () => {

    const navigation = useNavigation();

    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    let date = currentDate.getDate();

    const lastNum = date % 10;
    if(lastNum == 1) {
        date += "st";
    } else if(lastNum == 2) {
        date += "nd";
    } else if(lastNum == 3) {
        date += "rd";
    } else {
        date += "th";
    }

    const formattedDate = `${month} ${date}`;


    const[entryQuestions, setEntryQuestions] = useState(false);


    return (
        <View style={styles.container} > 
        <Text style={{ fontSize: 20, position: 'absolute', top: '45' }}>{formattedDate}</Text>
            <View style={styles.topContainer}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.replace('entrylist')}>
                    <Entypo name="chevron-left" size={18} />
                    <Text style={{ fontSize: 15}}>Entry List</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={{ fontSize: 15 }}>Options</Text>
                </TouchableOpacity>

            </View>

            {/* <View style={{ color: 'black', width: '100%', borderWidth: 1 }}/> */}

            <LinearGradient colors={['rgba(0,0,0,0.35)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 5, width: '100%' }} />

            <View style={styles.avatarContainer}>
                <View style={{ flexDirection: 'row', columnGap: 2, marginLeft: -5 }}>
                    {[...Array(3)].map((_, i) => (
                        <Text key={i} style={{ fontSize: 70 }}>•</Text>
                    ))}
                </View>

                <Text style={[{ fontSize: 60, fontWeight: 'bold' }]}>Avatar</Text>

                <View style={{ flexDirection: 'row', columnGap: 2, marginRight: -5 }}>
                    {[...Array(3)].map((_, i) => (
                        <Text key={i} style={{ fontSize: 70 }}>•</Text>
                    ))}
                </View>
            </View>
            <Entypo name="github" size={300} style={{ marginTop: -30}}/>

            <View style={{ flexDirection: 'row', columnGap: 2, width: '100%', justifyContent: 'center', marginTop: -40, marginBottom: -20  }}>
                {[...Array(30)].map((_, i) => (
                    <Text key={i} style={{ fontSize: 70 }}>•</Text>
                ))}
            </View>

                


            <View style={[{ flexDirection: 'col' }, styles.inputContainer]}>
                <TouchableOpacity style={{ width: '100%' }} onPress={() => {setEntryQuestions(true)}}>
                    <LinearGradient colors={['rgba(0,0,0,0.35)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.dailyEntryButton}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Daily Entry</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>


            {entryQuestions && (
                <View style={styles.dailyEntry}>
                    <TouchableOpacity onPress={() => {setEntryQuestions(false)}}>
                        <Text style={{fontSize: 50, color: 'purple'}}>Poop</Text>
                    </TouchableOpacity>

                </View>

            )}

        </View>

        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 40,
    },

    avatarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: -10,
    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        alignItems: 'center',
    },

    inputContainer: {
        flex: 1,
        padding: 20,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: 'black',
        marginVertical: 20,
        width: '90%',

        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    dailyEntryButton: {
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.35)',
        borderRadius: 20,

        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    dailyEntry: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,

        backgroundColor: 'rgba(0,0,0,0.5)',
    }
})

export default AvatarPage;