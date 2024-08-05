import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthStore } from '../store';


const Success = () => {

    const router  = useRouter()

    const handlePress = () => {
        router.replace("/(tabs)/home");
      };


      const role =AuthStore.getRawState().role

  return (
    <View style={styles.container}>
          <StatusBar
                 translucent
                 barStyle="light-content"
                 backgroundColor="#555"
              />
      <Image source={require('../images/checked.png')} style={styles.success} />
      { role === 'citizen'?

<View>
<Text sstyle={{...styles.msg,alignSelf:'center'}}>{'Your Complain have'}</Text>
<Text style={{...styles.msg,marginTop:2}}>{'been submitted succesfully'}</Text>
</View>

:

<View>
<Text style={{...styles.msg,alignSelf:'center'}}>{'Your post have'}</Text>
<Text style={{...styles.msg,marginTop:2}}>{'been submitted succesfully'}</Text>
</View>

      }
     

      <TouchableOpacity
        style={styles.gotohome}
        onPress={handlePress}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: {
    width: 100,
    height: 100,
  },
  msg: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
  },
  gotohome: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    marginTop: 30,
  },
});
