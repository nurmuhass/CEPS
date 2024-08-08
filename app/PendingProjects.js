import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { AuthStore } from '../store';
import { db } from '../firebase-config';
import ComplainBox from '../components/ComplainBox';
import Entypo from '@expo/vector-icons/Entypo';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from "expo-router";

const PendingProject = () => {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [post, setPosts] = useState([]);
    const user= AuthStore.getRawState().user;
    const role =AuthStore.getRawState().role
  const router =useRouter()
  
    useEffect(() => {
      // Fetch the user data first
      getUser();
    }, []); // Empty dependency array means this runs once when the component mounts
    
  
    useEffect(() => {
      if (userData) {
        fetchMyPosts();
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
    const fetchMyPosts = async () => {
      if (!userData) return;
    
      try {
        let queryCondition;
    
        if (userData.role === 'citizen') {
          queryCondition = query(collection(db, "posts"), where("userId", "==", user.uid), where("status", "==", 'pending'));
        } else if (userData.role === 'ministry') {
          queryCondition = query(collection(db, "posts"), where("Ministry", "==", userData.fullname), where("status", "==", 'pending'));
        } else if (userData.role === 'Governor') {
            queryCondition = query(collection(db, "posts"),  where("status", "==", 'pending'));
        }
    
        const unsubscribe = onSnapshot(queryCondition, (snapshot) => {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(list);
          if (loading) {
            setLoading(false);
          }
        }, (error) => {
          console.error('Error fetching posts:', error);
        });
    
        return () => unsubscribe(); // Detach listener when component unmounts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    

       // Define width percentages based on status
       let pendingWidth = 0;
       let activeWidth = 0;
       let completedWidth = 0;
     
       switch ('pending') {
         case 'pending':
           pendingWidth = '33%';
           break;
         case 'Active':
           pendingWidth = '33%';
           activeWidth = '33%';
           break;
         case 'Completed':
           pendingWidth = '33%';
           activeWidth = '33%';
           completedWidth = '34%';
           break;
         default:
           break;
       }



       const { status} = useLocalSearchParams(); // Get query parameters

       const handlePress = () => {

        if(status){
    
          router.replace('/(tabs)/profile')
   
        }else{
          router.back()
        }
        
    }

  return (
    <View style={{paddingTop:getStatusBarHeight(),backgroundColor:"#fff",}}>
     <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(255, 255, 255, 0)"
      />
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity style={{backgroundColor:'#f0f0f0',borderRadius:5,width:30,
    marginTop:12,height:28,alignItems:'center',justifyContent:'center',marginLeft:30}} onPress={handlePress}>
    <Ionicons name="chevron-back" size={18} color="black" />
  </TouchableOpacity>

<Text style={{fontSize:22,fontWeight:'bold',marginTop:12,backgroundColor:'#fff',
  padding:12,width:'94%',marginLeft:'3%',marginRight:'3%'}}>
  

  {userData ? (
    userData.role === 'citizen' ? 'My Pending Complains' :
    userData.role === 'ministry' ? 'Pending`s Complains' :
    'Pending Complains'
  ) : 'Loading...'}
   </Text> 
        </View>


 <View style={{marginHorizontal:10,marginTop:20}}>

<View>
      <View style={styles.container}>
        <View style={[styles.segment, { backgroundColor: 'grey', width: pendingWidth }]} />
        <View style={[styles.segment, { backgroundColor: 'yellow', width: activeWidth }]} />
        <View style={[styles.segment, { backgroundColor: 'green', width: completedWidth }]} />
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'grey' }]} />
          <Text style={styles.legendText}>Pending</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'yellow' }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
      </View>
    </View>
    </View>

     <FlatList
  data={post.length ? post : [{ placeholder: true }]}
  keyExtractor={(item) => item.id || 'placeholder'}
  renderItem={({ item }) => {
    if (item.placeholder) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff', height: 200 }}>
          <Entypo name="emoji-happy" size={72} color="black" />
          <Text style={{ marginVertical: 5 }}>No Complaints</Text>
          {userData ? (
            userData.role === 'citizen' ? (
              <Text style={{ alignSelf: 'center' }}>You currently don't have any pending complaints</Text>
            ) : userData.role === 'ministry' ? (
              <Text style={{ alignSelf: 'center' }}>There are currently no pending complaints </Text>
            ) : (
              <Text style={{ alignSelf: 'center' }}>There are currently no pending complaints </Text>
            )
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      );
    }
    return (
      <ComplainBox 
        Title={item.header} 
        date={item.postTime} 
        image={item.images[0]} 
        images={item.images} 
        id={item.id} 
      />
    );
  }}
  
/>
 
    </View>
  )
}

export default PendingProject

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 20,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10, // Add some space below the chart
        backgroundColor:"#fff"
      },
      segment: {
        height: '100%',
      },
      legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      },
      legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      legendColor: {
        width: 20,
        height: 20,
        borderRadius: 3,
        marginRight: 5,
      },
      legendText: {
        fontSize: 14,
      },
})