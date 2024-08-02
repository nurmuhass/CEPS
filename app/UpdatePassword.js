import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import Loading from '../components/Loading';
import Button from '../components/Button';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useRouter } from 'expo-router';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router =useRouter()
    const auth = getAuth();
    const user = auth.currentUser;
  
    const handleChangePassword = async () => {
        setLoading(true)
      try {
        // Step 1: Reauthenticate user with their current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
  
        // Step 2: Change the user's password
        await updatePassword(user, newPassword);
        setLoading(false)
        Alert.alert('Password Changed', 'Your password has been changed successfully!');
      router.replace("/(tabs)/profile")
   
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to change password. Please check your current password and try again.');
        setLoading(false)
      }
    };

    if (loading) {
        // Render a loading indicator or any other UI
        return  <View  style={{height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',zIndex:99}}>
        <Loading size={100} />
       </View>;
       
    }
        
  
    return (
 <View style={styles.container}>
               <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>
  <View style={{flexDirection:'row',alignItems:'center',marginTop:5,marginBottom:30}}>
  <Ionicons name="chevron-back" size={32} color="black"  onPress={router.back}
   style={{justifyContent:'flex-start',alignSelf:'flex-start',}}/>

   <Text style={{alignSelf:'center',marginLeft:"20%",fontWeight:'bold',fontSize:16}}>Change Password</Text>
  </View>

<View>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
  
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
  
     
        <Button title="Change Password" onPress={handleChangePassword} style={{width:'90%',alignSelf:'center',marginTop:30}}/>
      </View>
      </View>
      

    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:getStatusBarHeight(),
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChangePassword;
