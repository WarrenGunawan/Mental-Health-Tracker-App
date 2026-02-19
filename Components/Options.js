import { StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

import Octicons from '@expo/vector-icons/Octicons';


function Options({ onClose }) {
    const navigation = useNavigation();

    const handleSignOut = async() => {
        try {
            await signOut(auth);
        } catch(e) {
            alert(e.message);
        }
    }

    const handleEditProfile = async() => {
      try {
        navigation.navigate('profilepage', {
          mode: 'edit',
        })
      } catch(e) {
        alert(e.message);
      }

      onClose();
    }


    return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.panel}>
        <Octicons name='gear' size={35} color='#666666' style={[{ paddingBottom: 10, }]}/>

        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditProfile} style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  panel: {
    width: '80%',
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 30,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 15,
    backgroundColor: '#DDDDDD',
    width: '50%',
    paddingVertical: 15,

    marginVertical: 5,
  },
  buttonText: {
    color: '#666666',
    fontWeight: '600',
  },
});

export default Options;


