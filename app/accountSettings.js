import React, { useEffect,useState } from 'react'
import { ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db, storage } from '../firebase-config';
import Loading from '../components/Loading';
import Button from '../components/Button';
import { parameters } from '../constants/Styles';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const accountSettings = () => {
    const router =useRouter()


    const [uploading, setUploading] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    
  
   
  //get user
  const auth = getAuth();
  const user= auth.currentUser;

 
  const [formData, setFormData] = useState({
    image: userData.image || null,
    fullname: userData.fullname || '',
    email: userData.email || '',
    Phone: userData.phone || '',
    address: userData.address || '',

  });
  


  useEffect(() => {
    getUser();
  }, []);
  
  const getUser = async () => {
    const docRef = doc(db, 'users', user.uid);
  
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setFormData({
          image: docSnap.data().image,
          fullname: docSnap.data().fullname,
          email: docSnap.data().email,
          phone: docSnap.data().phone,
          address: docSnap.data().address,
     
        });
  
      } else {
        console.log('No User Data');
      }
  
      setLoading(false);
    });
  
    // This will detach the listener when the component is unmounted
    return () => unsubscribe();
  };
  
  const uploadImage = async () => {
    if( formData.image == null ) {
      return null;
    }
    const uploadUri = formData.image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

  setUploading(true);

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
  
    if (!formData.email) {
        newErrors.email = 'Please input email';
        isValid = false;
      } else if (!formData.email.match(/\S+@\S+\.\S+/)) {
        newErrors.email = 'Please input a valid email';
        isValid = false;
      }
  
      if (!formData.fullname) {
        newErrors.fullname = 'Please input fullname';
        isValid = false;
      }
  
      if (!formData.image || formData.image === 'null') {
        newErrors.image = 'Please Choose a Profile Picture';
        isValid = false;
      }
  
      if (!formData.phone) {
        newErrors.phone = 'Please input phone number';
        isValid = false;
      }
  
  
      if (!formData.address) {
        newErrors.address = 'Please input address';
        isValid = false;
      }
  
  
      setErrors(newErrors);
  
    if (isValid) {
      setLoading(true);
  
      const updatedData = {
    
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,

    
      };
  
      await updateUserData(updatedData); 
  
      setLoading(false);
    }
  
    setErrors(newErrors);
  };
  
  
  
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });
  
    if (!result.canceled) {
      setFormData((prevData) => ({ ...prevData, image: result.assets[0].uri }));
    }
  };
  

  const updateUserData = async () => {
    try {
      // Upload image if a new image is selected
      const imageUrl = await uploadImage();
  
      // Create an object with updated data
      const updatedData = {
        ...formData,
        imageUrl: imageUrl || formData.image, // Use the new image URL if available, otherwise keep the existing one
      };
  
      // Update the user data in the Firebase database
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, updatedData);
  
      // Display a success message
      Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
  
      // Navigate to the desired screen
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error('Error updating profile:', error.message);
      // Handle the error as needed
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

<TouchableOpacity style={{backgroundColor:'#f0f0f0',borderRadius:5,width:30,
    marginTop:20,height:28,alignItems:'center',justifyContent:'center'}} onPress={router.back}>
    <Ionicons name="chevron-back" size={28} color="black" />
  </TouchableOpacity>

        <ScrollView>    
                  {/* Display errors */}
          {Object.keys(errors).map((key) => (
            <Text key={key} style={{ color: 'red' ,alignItems:'center',justifyContent:'center'}}>
              {errors[key]}
            </Text>
          ))}
        <TouchableOpacity
      style={{
        padding: 13,
        borderRadius: 50,
        alignItems: 'center',
        width: 100,
        height: 100,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignSelf: 'center',
      }}
      onPress={pickImage}
    >
      <ImageBackground
        source={{
          uri: formData.image || 'default_image_url_if_not_available',
        }}
        style={{ height: 100, width: 100 }}
        imageStyle={{ borderRadius: 50 }}
      >
        {formData.image ? (
          // If an image is available, show nothing (no camera icon)
          null
        ) : (
          // If no image is available, show the camera icon
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
        )}
      </ImageBackground>
    </TouchableOpacity>
    
    <View>
    <TextInput
      style={styles.input}
      value={formData.fullname}
      placeholder='Full name'
      onChangeText={(text) => setFormData({ ...formData, fullname: text })}
    />
        {formData.fullname !='' ? null : <Text style={styles.star}>*</Text>}  
    
    </View>
    
     <View>
          <TextInput
            style={styles.input}
            value={formData.email}
            placeholder='Email'
           onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
         
          {formData.email !='' ? null :  <Text style={styles.star}>*</Text>} 
    </View>  
    
    <View>
          <TextInput
            style={styles.input}
            value={formData.phone}
            placeholder='Phone Number'
           onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
    
    {formData.phone !='' ? null :  <Text style={styles.star}>*</Text>} 
    
    </View> 

    <View>
          <TextInput
            style={styles.input}
            value={formData.address}
            placeholder='Address'
           onChangeText={(text) => setFormData({ ...formData, address: text })}
          />
    
    {formData.address !='' ? null :  <Text style={styles.star}>*</Text>} 
    
    </View> 

    

    <Button
                        title="Save Update"
                        filled
                        // isLoading={isLoading}
                        onPress={validate}
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                           width:'80%',
                           alignSelf:'center',
                        }}
                    />
                    </ScrollView>    
   

    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        paddingTop:getStatusBarHeight(),
        backgroundColor:"#f0f0f0",
        paddingBottom:5,
        flex:1,  
    },
    input: {
      height: 40,
      margin: 12,
      borderBottomWidth: 1,
      padding: 10,
      borderColor:'#86939e',
     
    },
    halfinput: {
        height: 40,
      width:170,
        borderBottomWidth: 1,
        padding: 10,
        borderColor:'#86939e',
       
      },
    
    styledButton:{
      backgroundColor:"#fff",
      alignContent:"center",
      justifyContent:"center",
      borderWidth:1, 
      borderColor:"#555",
      height:70,
      paddingHorizontal:20,
      width:'95%',
      margin:10,
      borderStyle:'dotted',
      borderRadius:8
    },
    
    buttonTitle:{
      color:"#555",
      fontSize:14,  
      marginTop:-3 
    },
    picker:{
      borderWidth:2, 
      borderColor:"#555",
    },
    star:{
      position:'absolute',right:25,top:10
    }
})


export default accountSettings