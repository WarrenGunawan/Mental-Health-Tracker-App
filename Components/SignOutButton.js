import { StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase';


function SignOutButton({ onClose }) {
    const handleSignOut = async() => {
        try {
            await signOut(auth);
        } catch(e) {
            alert(e.message);
        }
    }

    return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.panel}>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign Out</Text>
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
    padding: 50,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  button: {
    borderRadius: 15,
    backgroundColor: '#DDDDDD',
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#666666',
    fontWeight: '600',
  },
});

export default SignOutButton;


