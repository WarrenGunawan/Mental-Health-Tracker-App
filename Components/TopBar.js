import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';

import Options from './Options';
import { useState } from 'react';



function TopBar() {

    const [ selectedOptions, setSelectedOptions ] = useState(false);

    return (
        <>
            <View style={{ position: 'absolute', top: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <Text style={{ fontSize: 20, color: '#4A6080' }}>InnerHue </Text>
                <MaterialCommunityIcons name='bread-slice-outline' size={20} color='#4A6080' />
            </View>
            <View style={styles.topContainer}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setSelectedOptions(true)}>
                    <Text style={{ fontSize: 15, marginBottom: 1, color: '#4A6080' }}>Options </Text>
                    <Octicons name='gear' size={18} color='#4A6080'/>
                </TouchableOpacity>

            </View>

            <Modal
                visible={selectedOptions}
                transparent
                animationType='fade'
                >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }}>
                    <Options onClose={() => setSelectedOptions(false)} />
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        padding: 10,
        alignItems: 'center',

        backgroundColor: '#F4F7FA',
    },
});

export default TopBar;