import { Text, View, TextInput, StyleSheet, Alert, Image } from "react-native";
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
import Checkbox from "expo-checkbox"
import Loader from "../../components/Loader.js";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase-config.js";
import { doc, onSnapshot } from 'firebase/firestore';
export default function LogIn() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(); 
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [userData, setUserData] = useState(null);

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
  
      const getUser = () => {
        return new Promise((resolve, reject) => {
          const docRef = doc(db, 'users', resp.user.uid);
          const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data());
              resolve(docSnap.data());
            } else {
              console.log('No User Data');
              resolve(null);
            }
          }, reject);
  
          // Return the unsubscribe function to detach the listener when done
          return () => {
            unsubscribe();
          };
        });
      };
  
      // Wait for userData to be fetched
      const fetchedUserData = await getUser();
  
      AuthStore.update((store) => {
        store.user = resp.user;
        store.isLoggedIn = !!resp.user;
        store.role = fetchedUserData ? fetchedUserData.role : null;
        console.log(store.role);
      });
  
      setLoading(false);
      return { user: auth.currentUser };
  
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
  
  <View style={{marginTop:40,alignItems:'center'}}>
      <Image source={require("../../images/map.jpeg")} style={{width:80,height:70}}/>
  </View>


  <View style={{marginTop:20,alignItems:'center',marginBottom:30}}>
    <Text style={{fontSize:30,fontWeight:'bold'}}>Welcome back</Text>
    <Text style={{marginTop:5,color:'#555',fontSize:17,}}>sign in to access your account</Text>
  </View>
  
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
  
        <View style={{
                    flexDirection: 'row',
                    marginVertical: 6,
                    marginHorizontal:10,
                    justifyContent:'space-between',
                    alignItems:'center'
                }}>
        <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#F93C65' : undefined}
                    />

                    <Text>Remember me</Text>
                </View>

               <Text style={{marginRight:5,fontWeight:'semiBold',fontSize:14,color:'#F93C65'}}>Forget Password?</Text>
</View>

  
  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: 'grey',
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14,color:'grey' }}>Or continue with</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: 'grey',
                            marginHorizontal: 10
                        }}
                    />
                </View>

<View style={{justifyContent:'space-evenly',flexDirection:'row',marginVertical:12}}>
<Image source={require("../../images/google.png")} style={{width:30,height:30}}/>
<Image source={require("../../images/facebook.png")} style={{width:30,height:30}}/>
<Image source={require("../../images/twitter.png")} style={{width:30,height:30}}/>

</View>



                {loading ? 
  <View style={{marginTop:10,width:'90%',padding:15,
      backgroundColor:'#fff',color:'#F93C65',borderRadius:20,shadowColor:'#3E3E3E',
      shadowOffset:{width:0,height:10},shadowOpacity:0.2,shadowRadius:8,elevation:4,alignItems:'center',justifyContent:'center'}}>
        <Loader/>
    </View>
:

<Button
buttonStyle={{marginTop:10,width:'90%',padding:15,fontSize:28,
  backgroundColor:'#F93C65',color:'#fff',borderRadius:10,shadowColor:'#3E3E3E',shadowOffset:{width:0,height:10},shadowOpacity:0.2,shadowRadius:8,elevation:4}}

  onPress={validate}

>
  Next
  <Ionicons name="chevron-forward" size={20} color="white" style={{marginLeft:5}}/>
</Button>

}




  <View style={{marginTop:30,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
    <Text>New Member?</Text>
  <Text
                 onPress={() => {        
                  router.push("/create-account");
                }} style={{color:'#F93C65',marginLeft:3}}
        >
        Register now
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
    borderRadius: 15,
    borderColor: "#555",
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 15,
    paddingLeft:30
  },
  icon:{
    position:'absolute',right:40,top:15
  }
});
