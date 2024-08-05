import { Link, Redirect, Stack, useRouter } from "expo-router";
import { AuthStore, appSignOut } from "../../../store";
import { View, Text,StyleSheet, ScrollView,Pressable ,TouchableOpacity, Share} from 'react-native'
import React,{useState,useEffect} from 'react'
import { Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
 import { getDocs, collection, query, where ,  getDoc} from "firebase/firestore";
 import { getAuth, signOut } from "firebase/auth";
import { doc, onSnapshot } from 'firebase/firestore';
import { StatusBar } from 'react-native';
import { db } from "../../../firebase-config";
import { getStatusBarHeight } from "react-native-status-bar-height";


const Tab2Index = () => {
  const router = useRouter();


  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user= AuthStore.getRawState().user;



  useEffect(() => {
    getUser();
  }, []);
  
  
  const getUser = async () => {
  
  const docRef = doc(db, 'users', user.uid)
  
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
  
   if (docSnap.exists()) {
  
     setUserData(docSnap.data());
   } else {
     console.log('No User Data');
   }
  
   setLoading(false);
  });
  
  // This will detach the listener when the component is unmounted
  return () => {
   
   unsubscribe();
  };
  };


const url ="https://nurmuhass.github.io/muhassConsult_landingPage/"

const mycustomshare = async () => {
try {
const result = await Share.share({
message:('Download CEPS:'  + '\n' + url),
});
if(result.action === Share.sharedAction){
if(result.activityType){
  console.log('Shared with activity of:',  result.activityType)
}else{
 
}
}else if(result.action === Share.dismissedAction){
console.log('disabled')
}

}catch(error){
console.log(error.message)
}
}

  return (
    <View style={{ flex: 1,justifyContent:'center',   paddingTop:getStatusBarHeight(),}}>
  
  <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>
  

      {/* <Button
        onPress={async () => {
          const resp = await appSignOut();
          if (!resp?.error) {
            router.replace("/(auth)/login");
          } else {
            console.log(resp.error);
            Alert.alert("Logout Error", resp.error?.message);
          }
        }}
        title="LOGOUT"
      /> */}

<View style={{justifyContent:'space-between',flexDirection:'row'}}>
      <Text style={{marginLeft:10,fontSize:20,fontWeight:"bold",marginTop:5}}>Profile</Text>


<TouchableOpacity  onPress={async () => {
          const resp = await appSignOut();
          if (!resp?.error) {
            router.replace("/(auth)/welcome");
          } else {
            console.log(resp.error);
            Alert.alert("Logout Error", resp.error?.message);
          }
        }}>

<View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialCommunityIcons name="logout" size={24} color="black" style={{ marginRight: 13, marginTop: 3 }} />
  </View> 
</TouchableOpacity>

      </View>

 


      <View style={{alignItems:"center",justifyContent:"center"}}>
      {userData ? (
  <>
    <Image source={{uri:userData.image }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }} />
  
  <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: "bold", marginTop: 13 }}>{userData.fullname}</Text>

  </>
):


(

  <Image source={require('../../../images/user.jpg')} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }} />
)

}


      </View>

      <ScrollView>


   <View style={{marginVertical:30}}>

<Link href="/../accountSettings" style={styles.items}>
     
            <AntDesign name="adduser" size={24} color="black" />
     <Text style={{fontWeight:'500',marginLeft:7}}>
              Account Setting
      </Text>

</Link>
<TouchableOpacity > 
<Link href="/../UpdatePassword" style={styles.items}>
       <AntDesign name="lock" size={24} color="black" />
              <Text style={{fontWeight:'500',marginLeft:7}}>
              Change Password
              </Text>
            
       </Link>
 </TouchableOpacity>
   

       <TouchableOpacity > 
       <View style={styles.items}>
       <Entypo name="notification" size={24} color="black" />
              <Text style={{fontWeight:'500',marginLeft:7}}>
              Notification
              </Text>
            
       </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={mycustomshare}> 
          <View style={styles.items}>
          <Entypo name="creative-commons-sharealike" size={24} color="black" />
                  <Text style={{fontWeight:'500',marginLeft:7}}>
                  Invite People
                  </Text>
                
          </View>
       </TouchableOpacity>

       <TouchableOpacity > 
          <View style={styles.items}>
          <Entypo name="new-message" size={24} color="black" />
                  <Text style={{fontWeight:'500',marginLeft:7}}>
                  Contact Us
                  </Text>
                
          </View>
       </TouchableOpacity>
       

       <View style={styles.items}>
       <MaterialIcons name="policy" size={24} color="black" />
              <Text style={{fontWeight:'500',marginLeft:7}}>
              Privacy Policy
              </Text>
            
       </View>
       <View style={styles.items}>
       <FontAwesome5 name="file-signature" size={24} color="black" />
              <Text style={{fontWeight:'500',marginLeft:7}}>
              Terms and Conditions
              </Text>
            
       </View>
       <View style={styles.items}>
       <MaterialCommunityIcons name="logout" size={24} color="black"  />
       <TouchableOpacity onPress={async () => {
          const resp = await appSignOut();
          if (!resp?.error) {
            router.replace("/(auth)/welcome");
          } else {
            console.log(resp.error);
            Alert.alert("Logout Error", resp.error?.message);
          }
        }}
>
              <Text style={{fontWeight:'500',marginLeft:7}}>
              logout
              </Text>
       </TouchableOpacity>
       </View>


       


      </View>
      </ScrollView>


    </View>
  );
};
export default Tab2Index;
const styles = StyleSheet.create({

  items:{
    flexDirection:'row',alignItems:'center',borderBottomColor:"#555",
paddingVertical:15,borderTopWidth:0.5,paddingHorizontal:15,
  }
})