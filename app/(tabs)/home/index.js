import { Link, Redirect, Stack, useRouter } from "expo-router";
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import ComplainBox from "../../../components/ComplainBox";
import { TextInput } from "react-native";
import { ScrollView } from "react-native";
import { db } from "../../../firebase-config";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { AuthStore } from "../../../store";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../components/Loading";
import Entypo from '@expo/vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import {datas} from "../feed/"
import NetInfo from '@react-native-community/netinfo';

export const data = [

  
  {
    id: '13',
    title: 'Ministry of Information',
    image: require('../../../images/ministries/Information.jpeg'),
  },
  {
    id: '14',
    title: 'Ministry Land and physical planning',
    image: require('../../../images/ministries/Land and physical planning.jpeg'),
  },
  {
    id: '15',
    title: 'Ministry of Planning and budget',
    image: require('../../../images/ministries/Planning and budget.jpg'),
  },
  {
    id: '16',
    title: 'Ministry of Rural and community development',
    image: require('../../../images/ministries/Rural and community development.jpeg'),
  },
  {
    id: '17',
    title: 'Ministry of Science and technology',
    image: require('../../../images/ministries/Science and technology.jpeg'),
  },
  {
    id: '18',
    title: 'Ministry of Water resources',
    image: require('../../../images/ministries/Water resources.jpeg'),
  },
  {
    id: '19',
    title: 'Ministry of Solid Minerals Resources',
    image: require('../../../images/ministries/Solid Minerals Resources.jpeg'),
  },
  {
    id: '20',
    title: 'Ministry of Power and Renewable energy',
    image: require('../../../images/ministries/Power and Renewable energy.jpeg'),
  },
  {
    id: '21',
    title: 'Ministry of Internal Security and Special Service',
    image: require('../../../images/ministries/Internal Security and Special Service.jpeg'),
  },
  {
    id: '22',
    title: 'Ministry of Youth and sport',
    image: require('../../../images/ministries/Youth and sport.jpeg'),
  },
  {
    id: '23',
    title: 'Ministry of Special duties',
    image: require('../../../images/ministries/special duties.jpeg'),
  },
  {
    id: '24',
    title: 'Ministry of Works & housing',
    image: require('../../../images/ministries/Works & housing.jpeg'),
  },
];




const Item = ({ title, image }) => (
  <View style={styles.itemContainer}>
    <Image source={image} style={styles.image} />
    <Text style={styles.text} numberOfLines={6}>
      {title}
    </Text>
  </View>
);


const Tab1Index = () => {


  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [post, setPosts] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const user= AuthStore.getRawState().user;

  

  useEffect(() => {
    // Check network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (userData) {
      fetchMyPosts();
    }
  }, [userData, selectedMinistry]);


  useEffect(() => {
    // Fetch the user data first
    getUser();
  }, []); // Empty dependency array means this runs once when the component mounts

  
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
        queryCondition = query(collection(db, "posts"), where("userId", "==", user.uid));
      } else if (userData.role === 'ministry') {
        queryCondition = query(collection(db, "posts"), where("Ministry", "==", userData.fullname));
      } else if (userData.role === 'Governor') {
        if (selectedMinistry === 'All Ministries') {
          // Fetch all posts when "All Ministries" is selected
          queryCondition = collection(db, "posts");
        } else if (selectedMinistry === null) {
          queryCondition = collection(db, "posts");
        } else {
          queryCondition = query(collection(db, "posts"), where("Ministry", "==", selectedMinistry));
        }
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
  


  const renderColumn = (columnData) => (
    <View style={styles.columnContainer}>
      {columnData.map((item) => (
        <Item key={item.id} title={item.title} image={item.image} />
      ))}
    </View>
  );
  const handlePress = () => {
    router.replace('/../../PostComplain');
    
  };

const router = useRouter();
 // Split data into two columns
 const columnData = [data.slice(0, 3), data.slice(3, 6),
   data.slice(6, 9),data.slice(9, 12)];

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
    return  <View  style={{height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',zIndex:99}}>
    <Loading size={100} />
   </View>;
   
}


  return (
    <View style={{ flex: 1,paddingTop:getStatusBarHeight(),}}>
      {/* <Stack.Screen options={{ headerShown: true, title: "Home" }} /> */}
      {/* <Link href="/home/details">Go to Details</Link>
      <Link href="/home/new-entry-modal">Present modal</Link> */}
  <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>

  
<FlatList
	data={[{}]}
	renderItem={() =><>


<View style={{backgroundColor:'#fff',marginBottom:15,width:'100%',
 }}>

    <View style={{ justifyContent:'space-between',flexDirection:'row',marginBottom:30}}>
      
    <View style={{flexDirection:'row',justifyContent:'center'}}>
     <Image source={require("../../../images/logo.jpeg")} style={{width:50,height:50,marginTop:13,marginLeft:5}}/>
     <Text style={{fontSize:28,fontWeight:'bold',marginTop:17,}}>CEPS</Text>
  </View>
 

  <Image source={require("../../../images/map.jpeg")} resizeMethod="contain" style={{width:40,height:40,marginTop:15,marginRight:20,}}/>


 
    </View>
  
    <View
        style={{
          backgroundColor:'#fff',
          borderColor: '#86939e',
          borderWidth: 1,
          width:'95%',
          margin:10,
          borderRadius:30
          
        }}>
   <TouchableOpacity >
        <TextInput
          editable
          multiline
          numberOfLines={1}
          style={{padding: 10,borderRadius:20}}
          
          placeholder= {userData ? (userData.role === 'citizen' ? 'Post a Complain' : 'Make a post') : 'Loading...' }
          onFocus={handlePress}
        />
  </TouchableOpacity>
        </View>
</View>
<ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
      <View style={[styles.columnWrapper, styles.firstColumn]}>
        {renderColumn(columnData[0])}
      </View>
      <View style={[styles.columnWrapper, styles.secondColumn]}>
        {renderColumn(columnData[1])}
      </View>
      <View style={[styles.columnWrapper, styles.thirdColumn]}>
        {renderColumn(columnData[2])}
      </View>
      <View style={[styles.columnWrapper, styles.thirdColumn]}>
        {renderColumn(columnData[3])}
      </View>
      <Link href={"../feed"} style={{position:'absolute',bottom:5,right:50}}>
          <Text style={{alignSelf:'flex-end',fontSize:12,color:'#F93C65'}}>View All</Text>   
      </Link>
   
    </ScrollView>
  

<View style={{}}>
<Text style={{fontSize:22,fontWeight:'bold',marginTop:12,backgroundColor:'#fff',
  padding:12,width:'94%',marginLeft:'3%',marginRight:'3%'}}>
  

  {userData ? (
    userData.role === 'citizen' ? 'My Complains' :
    userData.role === 'ministry' ? 'Ministry Complains' :
    'Complains'
  ) : 'Loading...'}
   </Text>  
   {userData ?  ( userData.role === 'Governor' && (
  <View style={{ padding: 10 }}>
   <Picker
  selectedValue={selectedMinistry}
  onValueChange={(itemValue) => setSelectedMinistry(itemValue)}
  style={{ height: 50, width: '100%' }}
>
  <Picker.Item label="All Ministries" value={null || 'All Ministries'} />
  {datas.map((item) => (
    <Picker.Item label={item.title} value={item.title} key={item.id} />
  ))}
</Picker>

    
  </View>
) ) :''

}
<FlatList
  data={post.length ? post : [{ placeholder: true }]}
  keyExtractor={(item) => item.id || 'placeholder'}
  renderItem={({ item }) => {
    if (item.placeholder) {
      return(
        <View style={{justifyContent:'center',alignItems:'center',flex:1,backgroundColor:'#fff',height:200}}>
      
    
      <Entypo name="emoji-happy" size={72} color="black" />
      
        
  {userData ? (
    userData.role === 'citizen' ?      <Text style={{alignSelf:'center'}}>You Currently did not Submit any Complains</Text> :
    userData.role === 'ministry' ?      <Text style={{alignSelf:'center'}}>There are Currently no Complains Submitted</Text> :
   
   <>
     <Text style={{marginVertical:5}}>No Complains</Text>
   <Text style={{alignSelf:'center'}}>
      There are Currently no Complains Submitted</Text>
   </>
  
  ) :  <Text style={{alignSelf:'center'}}>
  Bad Internet connection
  
  </Text>}
   
        
        </View>
      )
    }
    return (
      <ComplainBox Title={item.header} date={item.postTime} image={item.images[0]} images={item.images} id={item.id}/>
      
    );
  }}
/>
 


</View>

</>}
    />
    </View>
  );
};
export default Tab1Index;

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingLeft:20
  },
  columnWrapper: {
    flexDirection: 'column',
  },
  firstColumn: {
    marginRight: 80, 
  },
  secondColumn: {
    marginRight: 70, 
  },
  thirdColumn: {
    marginLeft: 15, 
    marginRight: 102,
  },
forthColumn: {
  marginRight: 70, 
  },
  fifthColumn: {
    marginRight: 70, 
  },
  sixedColumn: {
    marginLeft: 25, 
    marginRight: 90,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  text: {
    marginLeft: 5,
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
