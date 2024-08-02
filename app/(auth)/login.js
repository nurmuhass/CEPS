import { Text, View, TextInput, StyleSheet, Alert } from "react-native";
import { AuthStore, } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StatusBar } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Toast from "../../components/Toast.js";
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Button } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import Loader from "../../components/Loader.js";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase-config.js";

export default function LogIn() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(); 
  const [errors, setErrors] = useState({});



  const validate = async () => {
    let isValid = true;
    const newErrors = {};
  

    if (!passwordRef.current) {
      newErrors.password = 'Please enter password';
      toastRef.current.show({
        type: 'error',
        text: "Please enter password",
        duration: 2000,
      });
      isValid = false;
    } else if (passwordRef.current.length < 6) {
      newErrors.password = 'Min password length is 6';
      toastRef.current.show({
        type: 'error',
        text: "Password length is less than 6",
        duration: 2000,
      });
      isValid = false;
    }
  
    if (!emailRef.current) {
      newErrors.email = 'Please enter email address';
      toastRef.current.show({
        type: 'error',
        text: "Please enter email address",
        duration: 2000,
      });
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailRef.current)) {
      newErrors.email = 'Please enter a valid email';
      toastRef.current.show({
        type: 'error',
        text: "Please enter a valid email",
        duration: 2000,
      });
      isValid = false;
    }
  
    setErrors(newErrors);
  
    if (isValid) {
      try {
        const resp = await appSignIn(
          emailRef.current,
          passwordRef.current,
        );
        if (resp?.user) {
          router.replace("/(tabs)/home");
        } else {
          console.log(resp.error)
          Alert.alert("Login Error", resp.error?.message)
        }
      } catch (error) {
        console.error("Login Error:", error);
        Alert.alert("Login Error", "An unexpected error occurred.");
      }
    }
  };


  const appSignIn = async (email, password) => {
    try {
      setLoading(true);
      const resp = await signInWithEmailAndPassword(auth, email, password);
      AuthStore.update((store) => {
        store.user = resp.user;
        store.isLoggedIn = resp.user ? true : false;
      });
      return { user: auth.currentUser };
      setLoading(false);
    } catch (e) {
      setLoading(false);
      return { error: e };
     
    }
  };



  return (
<>
    <View style={{ flex: 1,backgroundColor:'#ffffff' }}>
    <StatusBar
      translucent
      barStyle="dark-content"
      backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
  />
         <View style={{marginLeft:15 }}>
        <Stack.Screen
          options={{ title: "Create Account", headerLeft: () => <></> }}
        />
  
  
  <TouchableOpacity style={{backgroundColor:'#f0f0f0',borderRadius:5,width:30,
    marginTop:40,height:28,alignItems:'center',justifyContent:'center'}} onPress={router.back}>
    <Ionicons name="chevron-back" size={18} color="black" />
  </TouchableOpacity>
  
  <View style={{marginTop:20}}>
    <Text style={{fontSize:32,fontWeight:'bold'}}>Hey, </Text>
    <Text style={{fontSize:32,fontWeight:'bold'}}>Welcome Back</Text>
  </View>
  <Text style={{marginTop:40,color:'#555',fontSize:15}}>Please login to continue</Text>
  <Toast ref={toastRef} topValue={50} />
  
  <View style={{justifyContent:'center',marginTop:15}}>
  
  
  <View style={{alignContent:'center',}}>
          <TextInput
            placeholder="Enter Your Email"
            nativeID="email"
            onChangeText={(text) => {
              emailRef.current = text;
            }}
            style={{...styles.textInput}}
          />

        <Fontisto name="email" size={18} color="#555" style={styles.icon} />
          
  </View>
  

   <View>
         
          <TextInput
            placeholder="Enter Your Password"
            secureTextEntry={true}
            nativeID="password"
            onChangeText={(text) => {
              passwordRef.current = text;
            }}
            style={styles.textInput}
          />
          <Feather name="lock" size={18} color="#555"  style={styles.icon}/>
   </View>
        </View>
  
<View>
               <Text style={{marginRight:5,fontWeight:'bold',fontSize:14,marginLeft:'65%'}}>Forget Password?</Text>
</View>
       

{loading ? 
  <View style={{marginTop:10,width:'90%',padding:15,
      backgroundColor:'#fff',color:'#00C26F',borderRadius:20,shadowColor:'#3E3E3E',
      shadowOffset:{width:0,height:10},shadowOpacity:0.2,shadowRadius:8,elevation:4,alignItems:'center',justifyContent:'center'}}>
        <Loader/>
    </View>
:

<Button
buttonStyle={{marginTop:10,width:'90%',padding:15,
  backgroundColor:'#00C26F',color:'#fff',borderRadius:20,shadowColor:'#3E3E3E',shadowOffset:{width:0,height:10},shadowOpacity:0.2,shadowRadius:8,elevation:4}}

  onPress={validate}

>
  Login
</Button>

}




  <View style={{marginTop:30,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
    <Text>Don't have an account!</Text>
  <Text
                 onPress={() => {        
                  router.push("/create-account");
                }} style={{color:'#00C26F',marginLeft:3}}
        >
         Sign up
        </Text>
  </View>
  
        </View>
      </View>



    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: '92%',
    borderWidth: 1,
    borderRadius: 18,
    borderColor: "#555",
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 15,
    paddingLeft:40
  },
  icon:{
    position:'absolute',left:10,top:15
  }
});
