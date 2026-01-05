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
      {/* tap outside to close */}
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
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  button: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'rgba(0,0,0,0.7)',
    fontWeight: '600',
  },
});

export default SignOutButton;


