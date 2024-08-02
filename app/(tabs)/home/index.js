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



export const data = [
  {
    id: '1',
    title: 'Ministry of Women affairs',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '2',
    title: 'Ministry of Health',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '3',
    title: 'Ministry of Education',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '4',
    title: 'Ministry of Finance',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '5',
    title: 'Ministry of Agriculture',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '6',
    title: 'Ministry of Transport',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '7',
    title: 'Ministry Local government and community affairs',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '8',
    title: 'Ministry of Humanitarian',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '9',
    title: 'Ministry of Environment',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '10',
    title: 'Ministry Higher Education ',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '11',
    title: 'Ministry of Agriculture & natural resources',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '12',
    title: 'Ministry of Commerce and industry ',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '13',
    title: 'Ministry of Information ',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '14',
    title: 'Ministry Land and physical planning',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '15',
    title: 'Ministry of Planning and budget',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '16',
    title: 'Ministry of Rural and community development',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '17',
    title: 'Ministry of Science and technology',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '18',
    title: 'Ministry of Water resources',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '19',
    title: 'Ministry of Solid Minerals Resources',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '20',
    title: 'Ministry of Power and Renewable energy',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '21',
    title: 'Ministry of Internal Security and Special Service',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '22',
    title: 'Ministry of Youth and sport',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '23',
    title: 'Ministry of Special duties',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '24',
    title: 'Ministry of Works & housing',
    image: require('../../../images/Purple.png'),
  },
  {
    id: '25',
    title: 'Ministry of Special duties',
    image: require('../../../images/Purple.png'),
  },
];

const Item = ({ title, image }) => (
  <View style={styles.itemContainer}>
    <Image source={image} style={styles.image} />
    <Text style={styles.text} numberOfLines={3}>
      {title}
    </Text>
  </View>
);


const Tab1Index = () => {


  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [post, setPosts] = useState([]);

  const user= AuthStore.getRawState().user;



  useEffect(() => {
    getUser();
    fetchMyPosts();
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

  const fetchMyPosts = async () => {
    try {
      const querySnapshot = onSnapshot(
        query(collection(db, "posts"), where("userId", "==", user.uid)), 
        async (snapShot) => { // Make the callback function async
          const list = [];
          for (const doc of snapShot.docs) {
            let postData = { id: doc.id, ...doc.data() }; // Declare postData using let
        
            list.push(postData);
          
          }
  
          setPosts(list);
  
          if (loading) {
            setLoading(false);
          }
        },
        (error) => {
          // handle the error
        }
      );
  
      return () => {
        querySnapshot();
      };
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
 const columnData = [data.slice(0, 4), data.slice(4, 8),
   data.slice(8, 12),data.slice(12, 16),data.slice(16, 20),data.slice(20, 24)];

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
 

  {userData ? (
  <>
   <Image source={{uri:userData.image }} style={{width:40,height:40,marginTop:13,marginRight:10,borderRadius:20,borderWidth:2,borderColor:'green'}}/>


  </>
):


(

 
  <Image source={require("../../../images/user.jpg")} resizeMethod="contain" style={{width:40,height:40,marginTop:13,marginRight:10,borderRadius:20,borderWidth:2,borderColor:'green'}}/>
)

}


 
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
          // maxLength={400}
          style={{padding: 10,borderRadius:20}}
          placeholder='Post a Complain'
          onFocus={handlePress}
        />
  </TouchableOpacity>
        </View>
</View>

<ScrollView horizontal style={styles.scrollView}>
      <View style={[styles.columnWrapper, styles.firstColumn]}>
        {renderColumn(columnData[0])}
      </View>
      <View style={[styles.columnWrapper, styles.secondColumn]}>
        {renderColumn(columnData[1])}
      </View>
      <View style={[styles.columnWrapper, styles.thirdColumn]}>
        {renderColumn(columnData[2])}
      </View>
      <View style={[styles.columnWrapper, styles.forthColumn]}>
        {renderColumn(columnData[3])}
      </View>
      <View style={[styles.columnWrapper, styles.fifthColumn]}>
        {renderColumn(columnData[4])}
      </View>
      <View style={[styles.columnWrapper, styles.sixedColumn]}>
        {renderColumn(columnData[5])}
      </View>
    </ScrollView>
  

<View style={{}}>
<Text style={{fontSize:22,fontWeight:'bold',marginTop:12,backgroundColor:'#fff',
  paddingTop:6,width:'94%',marginLeft:'3%',marginRight:'3%'}}> My Complains</Text>    

<FlatList
  data={post.length ? post : [{ placeholder: true }]}
  keyExtractor={(item) => item.id || 'placeholder'}
  renderItem={({ item }) => {
    if (item.placeholder) {
      return <Text>No complaints available</Text>;
    }
    return (
      <ComplainBox Title={item.header} date={item.postTime} image={item.images[0]} images={item.images}/>
      
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
    marginRight: 70, 
  },
  secondColumn: {
    marginRight: 70, 
  },
  thirdColumn: {
    marginRight: 70, 
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
    width: 70,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },
  text: {
    marginLeft: 5,
  },
});
