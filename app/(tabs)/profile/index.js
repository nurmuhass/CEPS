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
import Ionicons from '@expo/vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';


const Tab2Index = () => {
  const router = useRouter();


  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postCounts, setPostCounts] = useState({ pending: 0, completed: 0, active: 0, total: 0 });
  const user= AuthStore.getRawState().user;
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
  
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    // Fetch the user data first
    getUser();
  }, []); // Empty dependency array means this runs once when the component mounts
  

  useEffect(() => {
    if (userData) {
      fetchPostsCounts();
    }
  }, [userData]);

  
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
  const fetchPostsCounts = async () => {
    if (!userData) return;
  
    const statuses = ['pending', 'Completed', 'Active'];
    const counts = { pending: 0, completed: 0, active: 0, total: 0 };
  
    try {
      // Create and fetch count for each status
      for (const status of statuses) {
        let queryCondition;
  
        if (userData.role === 'citizen') {
          queryCondition = query(collection(db, "posts"), 
            where("userId", "==", user.uid), 
            where("status", "==", status));
        } else if (userData.role === 'ministry') {
          queryCondition = query(collection(db, "posts"), 
            where("Ministry", "==", userData.fullname), 
            where("status", "==", status));
        } else if (userData.role === 'Governor') {
          queryCondition = query(collection(db, "posts"), 
            where("status", "==", status));
        }
  
        const snapshot = await getDocs(queryCondition);
        counts[status] = snapshot.size; // Get the count of documents
      }
  
      // Create and fetch count for all posts
      let queryCondition;
  
      if (userData.role === 'citizen') {
        queryCondition = query(collection(db, "posts"), where("userId", "==", user.uid));
      } else if (userData.role === 'ministry') {
        queryCondition = query(collection(db, "posts"), where("Ministry", "==", userData.fullname));
      } else if (userData.role === 'Governor') {
        queryCondition = query(collection(db, "posts"));
      }
  
      const totalSnapshot = await getDocs(queryCondition);
      counts.total = totalSnapshot.size; // Get the total count of documents
  
 
      setPostCounts(counts)
      // You can update the state or handle counts as needed
      // setPostCounts(counts);
  
    } catch (error) {
      console.error('Error fetching post counts:', error);
    }
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

const handlePress = (route, params) => {
    // Create a query string from the params object
    const queryString = new URLSearchParams(params).toString();
    // Append the query string to the route
    const urlWithParams = `${route}?${queryString}`;
    router.replace(urlWithParams);
};
if (!isConnected) {
  return (
    <View style={{ flex: 1,paddingTop:getStatusBarHeight(),backgroundColor:'#fff'}}>
    <View style={{ justifyContent:'space-between',flexDirection:'row',marginBottom:30}}>
 
 <View style={{flexDirection:'row',justifyContent:'center'}}>
  <Image source={require("../../../images/logo.jpeg")} style={{width:50,height:50,marginTop:13,marginLeft:5}}/>
  <Text style={{fontSize:28,fontWeight:'bold',marginTop:17,}}>CEPS</Text>
</View>
<Image source={require("../../../images/map.jpeg")} resizeMethod="contain" style={{width:40,height:40,marginTop:15,marginRight:20,}}/>

</View>  
 <View style={styles.noConnectionContainer}>
   <Entypo name="network" size={72} color="black" />
   <Text style={styles.noConnectionText}>Please check your internet connection.</Text>
 </View>

 </View>
  );
}


  return (
    <View style={{ flex: 1,justifyContent:'center',paddingTop:getStatusBarHeight(),}}>
  
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
      <Text style={{marginLeft:10,fontSize:20,fontWeight:"bold",marginTop:5,color:'#555'}}>Profile</Text>


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
    <MaterialCommunityIcons name="logout" size={24} color="#F93C65" style={{ marginRight: 13, marginTop: 3 }} />
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

<View style={{flexDirection:'row',marginTop:10}}>

<TouchableOpacity onPress={() => handlePress('../(tabs)/home')} style={{width:'45%',height:100,backgroundColor:'#fff',borderRadius:10,marginLeft:8,flexDirection:'row',justifyContent:'space-between'}}>
  <View style={{marginTop:20}}>
      <Text style={{marginLeft:15}}>Total Cases</Text>
      <Text style={{fontWeight:'bold',fontSize:20,fontSize:30,alignSelf:'center',marginTop:10}}>{postCounts.total}</Text>
  </View>

  <View style={{backgroundColor:'#18B368',height:35,width:35,marginTop:35,justifyContent:'center',alignItems:'center',marginRight:10,borderRadius:4}}>
  <MaterialIcons name="fullscreen-exit" size={22} color="#fff" />
</View>
</TouchableOpacity>

<TouchableOpacity onPress={() => handlePress('/../ActiveProject', { status: 'Active'})} style={{width:'45%',height:100,backgroundColor:'#fff',borderRadius:10,marginLeft:8,flexDirection:'row',justifyContent:'space-between'}}>
  <View style={{marginTop:20}}>
      <Text style={{marginLeft:15}}>Active Cases</Text>
      <Text style={{fontWeight:'bold',fontSize:20,fontSize:30,alignSelf:'center',marginTop:10}}>{postCounts.Active}</Text>
  </View>

  <View style={{backgroundColor:'#FFF5D9',height:35,width:35,marginTop:35,justifyContent:'center',alignItems:'center',marginRight:10,borderRadius:4}}>
  <AntDesign name="linechart" size={22} color="#FFBB38" />
</View>
</TouchableOpacity>



</View>

<View style={{flexDirection:'row',marginTop:10}}>

<TouchableOpacity onPress={() => handlePress('/../PendingProjects', { status: 'pending'})} style={{width:'45%',height:100,backgroundColor:'#fff',borderRadius:10,marginLeft:8,flexDirection:'row',justifyContent:'space-between'}}>
  <View style={{marginTop:20}}>
      <Text style={{marginLeft:15}}>Pending Cases</Text>
      <Text style={{fontWeight:'bold',fontSize:20,fontSize:30,alignSelf:'center',marginTop:10}}>{postCounts.pending}</Text>
  </View>

  <View style={{backgroundColor:'#FFDED1',height:35,width:35,marginTop:35,justifyContent:'center',alignItems:'center',marginRight:10,borderRadius:4}}>
  <Image source={require("../../../images/icon.png")}/>
</View>
</TouchableOpacity>

<TouchableOpacity onPress={() => handlePress('/../CompletedProjects', { status: 'Completed'})} style={{width:'45%',height:100,backgroundColor:'#fff',borderRadius:10,marginLeft:8,flexDirection:'row',justifyContent:'space-between'}}>
  <View style={{marginTop:20}}>
      <Text style={{marginLeft:15}}>Completed Cases</Text>
      <Text style={{fontWeight:'bold',fontSize:20,fontSize:30,alignSelf:'center',marginTop:10}}>{postCounts.Completed}</Text>
  </View>

  <View style={{backgroundColor:'#E7EDFF',height:35,width:35,marginTop:35,justifyContent:'center',alignItems:'center',marginRight:10,borderRadius:4}}>
  <Ionicons name="checkmark-done" size={22} color="#396AFF" />
</View>
</TouchableOpacity>



</View>


   <View style={{marginVertical:20}}>

     
   <Image source={require("../../../images/Group 708.png")} style={{width:'92%',alignSelf:'center',marginTop:10,}}/>

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
   

      

       <TouchableOpacity onPress={mycustomshare}> 
          <View style={{...styles.items,borderBottomWidth:0.5}}>
          <Entypo name="creative-commons-sharealike" size={24} color="black" />
                  <Text style={{fontWeight:'500',marginLeft:7}}>
                  Invite People
                  </Text>
                
          </View>
       </TouchableOpacity>





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
  },
  noConnectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noConnectionText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
})