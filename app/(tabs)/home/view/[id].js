import { View, Text, Image, ScrollView, StyleSheet, Dimensions ,Modal, Button, Alert, ActivityIndicator} from 'react-native';
import Swiper from 'react-native-swiper';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import RenderHTML from 'react-native-render-html';
import { FlatList } from 'react-native';
import { AuthStore } from '../../../../store';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
const ViewPost = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null); // Change to null initially
    const { width } = Dimensions.get('window');
    const [myPosts, setMyPosts] = useState([]);
    const user= AuthStore.getRawState().user;
    const role= AuthStore.getRawState().role;
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null); // Track which action to perform


  const router = useRouter()
    useEffect(() => {
      fetchPost();
    }, []);
  
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        // Fetch the user data first
        getUser();
      }, []); // Empty dependency array means this runs once when the component mounts
      
      useEffect(() => {
        // Fetch posts only after userData is set
        if (userData) {
          fetchMyPosts();
        }
      }, [userData]); // This runs whenever userData changes
      
    
      
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
            queryCondition = query(
              collection(db, "posts"), 
              where("userId", "==", user.uid),
           
            );
          } else if (userData.role === 'ministry') {
            queryCondition = query(
              collection(db, "posts"), 
              where("Ministry", "==", userData.fullname),
          
            );
          }
      
          const unsubscribe = onSnapshot(queryCondition, (snapshot) => {
            const list = snapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(post => post.images && post.images.length > 0); // Only include posts with images
            setMyPosts(list);
            setLoading(false);
          }, (error) => {
            console.error('Error fetching posts:', error);
            setLoading(false);
          });
      
          return () => unsubscribe(); // Detach listener when component unmounts
        } catch (error) {
          console.error('Error fetching posts:', error);
          setLoading(false);
        }
      };


       // Define width percentages based on status
  let pendingWidth = 0;
  let activeWidth = 0;
  let completedWidth = 0;

  switch (post?.status) {
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

const handlePress = () => {
    router.replace("../")
}


const openConfirmationModal = (action) => {
  setActionType(action);
  setModalVisible(true);
};

const closeConfirmationModal = () => {
  setModalVisible(false);
  setActionType(null);
};

const updateStatus = async (newStatus) => {
  try {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, { status: newStatus });
    closeConfirmationModal();
    fetchPost(); // Refresh post data after updating
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

if (loading) {
  return <ActivityIndicator size="large" />;
}

  
    if (!post) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }
  
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
<TouchableOpacity style={{backgroundColor:'#f0f0f0',borderRadius:5,width:30,
    marginTop:40,height:28,alignItems:'center',justifyContent:'center'}} onPress={handlePress}>
    <Ionicons name="chevron-back" size={18} color="black" />
  </TouchableOpacity>
        <ScrollView contentContainerStyle={{  }}>
        <Swiper
  autoplay={true}
  autoplayTimeout={3} // Adjust this value as needed
  loop={true}
  style={{ height: 250 }}
  showsPagination={true}
>
  {post.images && post.images.length > 0 ? (
    post.images.map((image, index) => (
      <View style={styles.slide} key={index}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain" // or "cover" depending on the desired behavior
        />
      </View>
    ))
  ) : (
    <Text>No images available</Text>
  )}
</Swiper>
{/* userData.role === 'citizen' */}
{userData?.role != 'citizen' && (
        <>
          {post.status === 'pending' && (
            <TouchableOpacity
              style={{ width: 90, height: 80, borderRadius: 130, backgroundColor: '#E7EDFF', position: 'absolute', right: 10, alignItems: 'center', justifyContent: 'center', top: '20%' }}
              onPress={() => openConfirmationModal('Active')}
            >
              <Text style={{ fontSize: 11 }}>Mark as Active</Text>
              <Ionicons name="checkmark-done" size={22} color="#396AFF" />
            </TouchableOpacity>
          )}

          {post.status === 'Active' && (
            <TouchableOpacity
              style={{ width: 90, height: 80, borderRadius: 130, backgroundColor: '#E7EDFF', position: 'absolute', right: 10, alignItems: 'center', justifyContent: 'center', top: '20%' }}
              onPress={() => openConfirmationModal('Completed')}
            >
              <Text style={{ fontSize: 11 }}>Mark as </Text>
              <Text style={{ fontSize: 11 }}>Completed</Text>
              <Ionicons name="checkmark-done" size={22} color="#396AFF" />
            </TouchableOpacity>
          )}
        </>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeConfirmationModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              Are you sure you want to mark this complain as {actionType}?
            </Text>
            <Button title="Yes" onPress={() => updateStatus(actionType)} color="#396AFF" />
            <Button title="No" onPress={closeConfirmationModal} color="#F93C65" />
          </View>
        </View>
      </Modal>


<View style={{marginHorizontal:10}}>

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

<Text style={styles.title}>{post.header}</Text>

<RenderHTML style={{...styles.description,color:'#111'}} contentWidth={width} source={{ html: post.content }} />

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10,marginBottom:15}}>
<Text style={{ fontSize: 20,
       fontWeight: 'bold',
   }}>Reports</Text> 
<Link href={"../"} style={styles.viewAllLink}>
                <Text style={styles.viewAllText}>See All</Text>   
            </Link>
</View>



<ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
            <View style={styles.imageContainer}>
                {myPosts.length > 0 ? (
                    myPosts.map((post, index) => (
                        <View style={styles.imageWrapper} key={index}>
                            <Image
                                source={{ uri: post.images[0] }}
                                style={styles.image}
                                resizeMode="cover" // Use 'cover' for full image cover, 'contain' to see the entire image
                            />
                        </View>
                    ))
                ) : (
                    <Text>No images available</Text>
                )}
            </View>
     
        </ScrollView>

<View>
<Text style={{ fontSize: 18,
       fontWeight: 'bold',marginTop:20
   }}>Recent Activities</Text> 


<View style={{flexDirection:'row',justifyContent:'space-between',padding:20,alignItems:'center'}}>

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

        <View style={{padding:10,backgroundColor:'#FFF5D9',borderRadius:25}}>
            <AntDesign name="linechart" size={22} color="#FFBB38" />
        </View>

        <View style={{marginLeft:10}}>
            <Text style={{fontWeight:'bold'}}>Active Projects</Text>
            <Text style={{fontSize:12,color:'grey'}}>28 january 2021</Text>
        </View>

</View>

<View style={{marginRight:5}}>
    <Text style={{color:'grey'}}>view</Text>
</View>

</View>

<View style={{flexDirection:'row',justifyContent:'space-between',padding:20,alignItems:'center',paddingTop:1}}>

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>


        <View style={{padding:10,backgroundColor:'#E7EDFF',borderRadius:25}}>
       
            <Ionicons name="checkmark-done" size={22} color="#396AFF" />
        </View>

        <View style={{marginLeft:10}}>
            <Text style={{fontWeight:'bold'}}>Completed Projects</Text>
            <Text style={{fontSize:12,color:'grey'}}>28 january 2021</Text>
        </View>

</View>

<View style={{marginRight:5}}>
    <Text style={{color:'grey'}}>view</Text>
</View>

</View>


<View style={{flexDirection:'row',justifyContent:'space-between',padding:20,alignItems:'center',paddingTop:1}}>

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

        <View style={{padding:10,backgroundColor:'#FFDED1',borderRadius:25}}>
           
            <Image source={require("../../../../images/icon.png")}/>
        </View>

        <View style={{marginLeft:10}}>
            <Text style={{fontWeight:'bold'}}>Pending Projects</Text>
            <Text style={{fontSize:12,color:'grey'}}>28 january 2021</Text>
        </View>

</View>

<View style={{marginRight:5}}>
    <Text style={{color:'grey'}}>view</Text>
</View>

</View>


</View>

</View>

        </ScrollView>
      </View>
    );
  };
  
  export default ViewPost;
   

  
const styles = StyleSheet.create({
    slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      paddingVertical:5,
      marginTop:0
    },
    description: {
      fontSize: 16,
      marginVertical: 12,
      
    },
    scrollView: {
        paddingHorizontal: 10,
    },
    imageContainer: {
        flexDirection: 'row',
    },
    imageWrapper: {
        height: 200,
        width: 250,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
    },
    viewAllLink: {
        position: 'absolute',
        bottom: 5,
        right: 15,
    },
    viewAllText: {
        alignSelf: 'flex-end',
        fontSize: 15,
       fontWeight: 'bold',
    },
     container: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10, // Add some space below the chart
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
});