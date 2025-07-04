import { View, Text, Image, FlatList, StyleSheet, Dimensions, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../../firebase-config";
import { useEffect, useState } from "react";
import { AuthStore } from "../../../store";
import RenderHTML from 'react-native-render-html';
import Loading from "../../../components/Loading";
import { getDoc} from "firebase/firestore";
import NetInfo from '@react-native-community/netinfo';
import Entypo from '@expo/vector-icons/Entypo';
import { TouchableOpacity } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
const posts = [
  {
    id: '1',
    ministry: 'Ministry of Health',
    time: '2 min',
    content: 'Vaccination campaign has started in the city.',
    hasImage: false,
    imageUrl: null,
  },
  {
    id: '2',
    ministry: 'Ministry of Education',
    time: '10 min',
    content: 'New curriculum guidelines are released.New curriculum guidelines are released',
    hasImage: true,
    imageUrl: require("../../../images/download.jpeg"),
  },
  {
    id: '3',
    ministry: 'Ministry of Infrastructure',
    time: '30 min',
    content: 'Road maintenance works in progress on Main Street.',
    hasImage: false,
    imageUrl: null,
  },
  {
    id: '4',
    ministry: 'Ministry of Environment',
    time: '45 min',
    content: 'Tree planting event scheduled for next week.',
    hasImage: true,
    imageUrl: require("../../../images/download.jpeg"),
  },
  {
    id: '5',
    ministry: 'Ministry of Transport',
    time: '1 hour',
    content: 'New public transport routes have been announced.',
    hasImage: false,
    imageUrl: null,
  },
  {
    id: '6',
    ministry: 'Ministry of Finance',
    time: '1 hour',
    content: 'New tax regulations are now in effect.',
    hasImage: true,
    imageUrl: require("../../../images/download.jpeg"),
  },
  {
    id: '7',
    ministry: 'Ministry of Culture',
    time: '1 hour 30 min',
    content: 'Cultural festival preparations are underway.',
    hasImage: false,
    imageUrl: null,
  },
  {
    id: '8',
    ministry: 'Ministry of Agriculture',
    time: '2 hours',
    content: 'New agricultural subsidies are available for farmers.',
    hasImage: true,
    imageUrl: require("../../../images/download.jpeg"),
  },
  {
    id: '9',
    ministry: 'Ministry of Tourism',
    time: '2 hours 15 min',
    content: 'Tourism promotion campaign launched.',
    hasImage: false,
    imageUrl: null,
  },
  {
    id: '10',
    ministry: 'Ministry of Information',
    time: '2 hours 30 min',
    content: 'Public announcement on recent policy changes.',
    hasImage: true,
    imageUrl: require("../../../images/download.jpeg"),
  },
];




export default function TimeLine() {
  const router = useRouter();
const [timeline,setTimeline]=useState(null)
const [loading, setLoading] = useState(false);
const [userData, setUserData] = useState(null);
const { width } = Dimensions.get('window');
const [isConnected, setIsConnected] = useState(true);
const user= AuthStore.getRawState().user;
const [likedPosts, setLikedPosts] = useState({});

useEffect(() => {
  // Check network connectivity
  const unsubscribe = NetInfo.addEventListener(state => {
    setIsConnected(state.isConnected);
  });

  // Cleanup listener on component unmount
  return () => unsubscribe();
}, []);

useEffect(() => {
  const initializeLikedPosts = () => {
    const initialLikedPosts = {};
    timeline.forEach(post => {
      // Check if likedByUser is defined and default to an empty array if not
      const likedByUser = post.likedByUser || [];
      initialLikedPosts[post.id] = likedByUser.includes(user.uid);
    });
    setLikedPosts(initialLikedPosts);
  };

  if (timeline) {
    initializeLikedPosts();
  }
}, [timeline, user.uid]);


const toggleLike = async (postId) => {
  try {
    const isLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));

    const postRef = doc(db, 'timeline', postId);

    // Fetch current post data
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();

    // Ensure likedByUser is initialized
    const likedByUser = postData.likedByUser || [];

    await updateDoc(postRef, {
      likedByUser: isLiked
        ? likedByUser.filter(id => id !== user.uid) // Remove user ID if already liked
        : [...likedByUser, user.uid] // Add user ID if not liked
    });
  } catch (error) {
    console.error('Error updating like status:', error);
  }
};


// Inside your component or function
const getTimeline = async () => {
  try {
    setLoading(true); // Start loading

    const list = [];

    const unsubscribe = onSnapshot(collection(db, "timeline"), async (querySnapshot) => {
      list.length = 0; // Clear the list to prevent duplicates

      // Create an array of promises to fetch user data for each post
      const userDataPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const postData = { id: docSnapshot.id, ...docSnapshot.data() };

        // Fetch user data using the userId from the postData
        const userRef = doc(db, 'users', postData.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Attach user data to the postData object
          return { ...postData, userData };
        } else {
          console.log('No User Data');
          return { ...postData, userData: null };
        }
      });

      // Resolve all promises and set the timeline state
      const resolvedPosts = await Promise.all(userDataPromises);
      setTimeline(resolvedPosts);
      setLoading(false); // Stop loading after setting the timeline
    });

    // Return the unsubscribe function to stop listening when needed
    return unsubscribe;
  } catch (e) {
    console.error('Error fetching timeline:', e);
    setLoading(false); // Stop loading in case of error
  }
};


useEffect(() => {
  getTimeline();

}, []);

if (timeline === 0) {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff', height: 200 }}>
      <Entypo name="emoji-happy" size={72} color="black" />
      <Text style={{ marginVertical: 5 }}>No Post</Text>
      <Text style={{ alignSelf: 'center' }}>There are Currently no Posts</Text>
    </View>
  );
}
  
const renderItem = ({ item }) => (
  <View style={styles.postContainer}>
    <View style={styles.headerContainer}>
      <Image
        source={item.userData?.image ? { uri: item.userData.image } : require("../../../images/user.jpg")}
        style={styles.profileImage}
      />
      <View style={styles.headerTextContainer}>
        <View style={styles.headerText}>
          <Text style={styles.username}>{item.Ministry}</Text>
          <Text style={styles.timestamp}>{item.time}</Text>
        </View>
        <RenderHTML contentWidth={width} source={{ html: item.content }} />
      </View>
    </View>
    {item.hasImage && item.images && item.images[0] && (
      <Image source={{ uri: item.images[0] }} style={styles.postImage} />
    )}
    <View style={styles.actionsContainer}>
    <TouchableOpacity onPress={() => toggleLike(item.id)}>
        <AntDesign
          name={likedPosts[item.id] ? 'heart' : 'hearto'}
          size={20}
          color={likedPosts[item.id] ? 'red' : 'black'}
        />
      </TouchableOpacity>
      <AntDesign name="sharealt" size={20} color="black" />
      <Ionicons name="stats-chart-outline" size={20} color="black" />
    </View>
  </View>
);


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

    if (loading) {
      // Render a loading indicator or any other UI
      return (
        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', zIndex: 99 }}>
          <Loading size={100} />
        </View>
      );
    }


  return (
    <View style={{ flex: 1,paddingTop:getStatusBarHeight(),backgroundColor:'#fff'}}>
     <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(255, 255, 255, 0)"
      />
    <View style={{ justifyContent:'space-between',flexDirection:'row',marginBottom:30}}>
      
      <View style={{flexDirection:'row',justifyContent:'center'}}>
       <Image source={require("../../../images/logo.jpeg")} style={{width:50,height:50,marginTop:13,marginLeft:5}}/>
       <Text style={{fontSize:28,fontWeight:'bold',marginTop:17,}}>CEPS</Text>
    </View>
   
  
    <Image source={require("../../../images/map.jpeg")} resizeMethod="contain" style={{width:40,height:40,marginTop:15,marginRight:20,}}/>
  
  
   
      </View>
 <FlatList
      data={timeline}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />

    </View>
  );
}

//https://fonts.google.com/specimen/Encode+Sans+Semi+Condensed


const styles = StyleSheet.create({
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ee',
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
  },
  content: {
    fontSize: 13,
    color: 'grey',
    marginTop: 5,
    flexShrink: 1,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 13,
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
});
