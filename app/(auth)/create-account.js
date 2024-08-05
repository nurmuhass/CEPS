import { Text, View, TextInput, StyleSheet, StatusBar ,ImageBackground,
   ScrollView,
   FlatList} from "react-native";
import { useRef, useState } from "react";
import { AuthStore } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Button } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase-config.js";
import Loader from "../../components/Loader.js";
import { Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { collection, addDoc ,getDocs, setDoc, doc} from "firebase/firestore"; 
import Toast from "../../components/Toast.js";
import { Image } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Checkbox from "expo-checkbox";

export default function CreateAccount() {
  const router = useRouter();
  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const passwordRef = useRef("");
  const phoneRef = useRef("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(); 
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });

if (!result.canceled) {
      setImage(result.assets[0].uri);   
    }
  };
    

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;



    const storageRef = ref(storage, 'Profile_Pictures/' + filename);
const img = await fetch(uploadUri);
const bytes =await img.blob();
    const task= await uploadBytes(storageRef,bytes);
   
  
    try {
      await task;

      const url = await  getDownloadURL(storageRef);

    
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };


  const validate = async () => {
    let isValid = true;
    const newErrors = {};
  
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
  
    if (!fullNameRef.current) {
      newErrors.fullname = 'Please enter fullname';
      toastRef.current.show({
        type: 'error',
        text: "Please enter fullname",
        duration: 2000,
      });
      isValid = false;
    }
  
    if (!image || image === 'null') {
      newErrors.image = 'Please Choose a Profile Picture';
      toastRef.current.show({
        type: 'error',
        text: "Upload Profile Picture",
        duration: 2000,
      });
      isValid = false;
    }
  
    if (!phoneRef.current) {
      newErrors.phone = 'Please enter phone number';
      toastRef.current.show({
        type: 'error',
        text: "Please enter phone number",
        duration: 2000,
      });
      isValid = false;
    }

  
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
  
    setErrors(newErrors);
  
    if (isValid) {
      try {
        const resp = await appSignUp(
          emailRef.current,
          passwordRef.current,
        );
        if (resp?.user) {
          router.replace("/(tabs)/home");
        } else {
          console.log(resp.error);
          Alert.alert("Sign Up Error", resp.error?.message);
        }
      } catch (error) {
        console.error("Sign Up Error:", error);
        Alert.alert("Sign Up Error", "An unexpected error occurred.");
      }
    }
  };
  


  const appSignUp = async (email, password) => {
    try {
      setLoading(true);
      // This will trigger onAuthStateChange to update the store..
      const resp = await createUserWithEmailAndPassword(auth, email, password);
  
      const adduser = async () => {    
        const docRef = doc(db, "users", auth.currentUser.uid); 
  
        const imageUrl = await uploadImage();
  
        await setDoc(docRef, {
          image: imageUrl,
          fullname: fullNameRef.current,
          email: emailRef.current,
          phone: phoneRef.current,
          role: 'citizen',
        });
      };
  
      await adduser();
  
      AuthStore.update((store) => {
        store.user = auth.currentUser;
        store.isLoggedIn = true;
        store.role = 'citizen';
      });
  
      setLoading(false);
      return { user: auth.currentUser };
    } catch (e) {
      setLoading(false);
      return { error: e };
    }
  };
  


  return (
    <View style={{ flex: 1,backgroundColor:'#ffffff',paddingTop:getStatusBarHeight()}}>
  <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>
       <View style={{marginLeft:15,marginBottom:30 }}>

       <ScrollView contentContainerStyle={{ flexGrow: 1 ,}}>
      <Stack.Screen
        options={{ title: "Create Account", headerLeft: () => <></> }}
      />

<TouchableOpacity style={{backgroundColor:'#f0f0f0',borderRadius:5,width:30,
  height:28,alignItems:'center',justifyContent:'center'}} onPress={router.back}>
    <Ionicons name="chevron-back" size={18} color="black" />
  </TouchableOpacity>

  <View style={{marginTop:5,alignItems:'center'}}>
      <Image source={require("../../images/map.jpeg")} style={{width:80,height:70}}/>
  </View>


  <View style={{marginTop:15,alignItems:'center'}}>
    <Text style={{fontSize:30,fontWeight:'bold'}}>Get Started</Text>
    <Text style={{marginTop:5,color:'#555',fontSize:17,}}>by creating a free account</Text>
  </View>


<Toast ref={toastRef} topValue={80} />
 
<View style={{justifyContent:'center',marginTop:5}}>
<TouchableOpacity
      style={{  padding: 13,
        borderRadius: 50,
        alignItems: 'center',width:100,height:100,backgroundColor:'grey',justifyContent:'center',
        marginTop:20,
        alignSelf:'center',marginBottom:20}}
      onPress={pickImage}>
         <ImageBackground
            source={{
              uri: image
            }}
            style={{height: 100, width: 100}}
            imageStyle={{borderRadius: 50}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="camera"
                size={35}
                color="#fff"
                style={{
                  opacity: 0.7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#fff',
                  borderRadius: 10,
                }}
              />
            </View>
          </ImageBackground>
</TouchableOpacity>


<View style={{alignContent:'center'}}>
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
          placeholder="Enter Your FullName"
          nativeID="FullName"
          onChangeText={(text) => {
            fullNameRef.current = text;
          }}
          style={styles.textInput}
        />

        <FontAwesome5 name="user" size={18} color="#555"  style={styles.icon}/>
      </View>

      <View>
       
       <TextInput
         placeholder="Enter Your Phone Number"
         nativeID="phone"
         onChangeText={(text) => {
          phoneRef.current = text;
         }}
         style={styles.textInput}
       />
<AntDesign name="phone" size={18} color="#555"  style={styles.icon} />
     
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

<Text style={{alignItems:'center',fontSize:11}}>
  By checking the box you agree to our{' '}
  <Text style={{ color: '#F93C65' }}>Terms</Text> and{' '}
  <Text style={{ color: '#F93C65' }}>Conditions</Text>
</Text>
                </View>

               
</View>
 

      {loading ? 
  <View style={{marginTop:10,width:'95%',padding:15,
      backgroundColor:'#fff',color:'#00C26F',borderRadius:20,shadowColor:'#3E3E3E',
      shadowOffset:{width:0,height:10},shadowOpacity:0.2,shadowRadius:8,elevation:4,alignItems:'center',justifyContent:'center'}}>
        <Loader/>
    </View>
:


      <Button
      buttonStyle={{marginTop:10,width:'95%',padding:15,
        backgroundColor:'#F93C65',color:'#fff',borderRadius:10,shadowColor:'#3E3E3E',shadowOffset:{width:0,height:10},shadowOpacity:0.2,shadowRadius:8,elevation:4}}

        onPress={validate}
      >
      Next

        <Ionicons name="chevron-forward" size={20} color="white" style={{marginLeft:5}}/>
      </Button>

}
<View style={{marginTop:15,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
  <Text>Already have an account!</Text>
<Text
        onPress={() => {
          router.push("/login");
        }} style={{color:'#F93C65',marginLeft:3}}
      >
        Login
      </Text>
</View>
</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: "#455fff",
  },
  textInput: {
    width: '95%',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#555",
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 15,
    paddingLeft:25
  },
  icon:{
    position:'absolute',right:40,top:15
  }
});
