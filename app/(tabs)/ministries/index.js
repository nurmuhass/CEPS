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




export const datas = [
  {
    id: '1',
    title: 'Ministry Higher Education',
    image: require('../../../images/ministries/higherEducation.jpeg'),
  },
  {
    id: '2',
    title: 'Ministry of Health',
    image: require('../../../images/ministries/health.jpeg'),
  },
  {
    id: '3',
    title: 'Ministry of Education',
    image: require('../../../images/ministries/education.jpeg'),
  },
  {
    id: '4',
    title: 'Ministry of Finance',
    image: require('../../../images/ministries/Finance.jpeg'),
  },
  {
    id: '5',
    title: 'Ministry of Agriculture',
    image: require('../../../images/ministries/Agriculture.jpeg'),
  },
  {
    id: '6',
    title: 'Ministry of Transport',
    image: require('../../../images/ministries/Transport.jpeg'),
  },
  {
    id: '7',
    title: 'Ministry Local government and community affairs',
    image: require('../../../images/ministries/Local government.jpeg'),
  },
  {
    id: '8',
    title: 'Ministry of Humanitarian',
    image: require('../../../images/ministries/Humanitarian.jpeg'),
  },
  {
    id: '9',
    title: 'Ministry of Environment',
    image: require('../../../images/ministries/Environment.jpeg'),
  },
  {
    id: '10',
    title: ' Ministry of Women affairs',
    image: require('../../../images/ministries/Women affairs.jpg'),
  },
  {
    id: '11',
    title: 'Ministry of Agriculture & natural resources',
    image: require('../../../images/ministries/Agriculture & natural resources.jpeg'),
  },
  {
    id: '12',
    title: 'Ministry of Commerce and industry ',
    image: require('../../../images/ministries/Commerce and industry.jpeg'),
  },
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



const Ministries = () => {


  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [post, setPosts] = useState([]);

  const user= AuthStore.getRawState().user;



  // useEffect(() => {
  //   getUser();
  //   fetchMyPosts();
  // }, []);
  
  
  // const getUser = async () => {
  
  // const docRef = doc(db, 'users', user.uid)
  
  // const unsubscribe = onSnapshot(docRef, (docSnap) => {
  
  //  if (docSnap.exists()) {
  
  //    setUserData(docSnap.data());
  //  } else {
  //    console.log('No User Data');
  //  }
  
  //  setLoading(false);
  // });
  
  // // This will detach the listener when the component is unmounted
  // return () => {
   
  //  unsubscribe();
  // };
  // };

  // const fetchMyPosts = async () => {
  //   try {
  //     const querySnapshot = onSnapshot(
  //       query(collection(db, "posts"), where("userId", "==", user.uid)), 
  //       async (snapShot) => { // Make the callback function async
  //         const list = [];
  //         for (const doc of snapShot.docs) {
  //           let postData = { id: doc.id, ...doc.data() }; // Declare postData using let
        
  //           list.push(postData);
          
  //         }
  
  //         setPosts(list);
  
  //         if (loading) {
  //           setLoading(false);
  //         }
  //       },
  //       (error) => {
  //         // handle the error
  //       }
  //     );
  
  //     return () => {
  //       querySnapshot();
  //     };
  //   } catch (error) {
  //     console.error('Error fetching posts:', error);
  //   }
  // };
  


  // const renderColumn = (columnData) => (
  //   <View style={styles.columnContainer}>
  //     {columnData.map((item) => (
  //       <Item key={item.id} title={item.title} image={item.image} />
  //     ))}
  //   </View>
  // );
  // const handlePress = () => {
  //   router.replace('/../../PostComplain');
    
  // };

// const router = useRouter();
//  // Split data into two columns
//  const columnData = [datas.slice(0, 4), datas.slice(4, 8),
//    datas.slice(8, 12),datas.slice(12, 16),datas.slice(16, 20),datas.slice(20, 24)];

  return (
    <View style={{ flex: 1,paddingTop:getStatusBarHeight(),backgroundColor:'#fff'}}>
      {/* <Stack.Screen options={{ headerShown: true, title: "Home" }} /> */}
      {/* <Link href="/home/details">Go to Details</Link>
      <Link href="/home/new-entry-modal">Present modal</Link> */}
  <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>

<View style={{ justifyContent:'space-between',flexDirection:'row',marginBottom:30}}>
      
      <View style={{flexDirection:'row',justifyContent:'center'}}>
       <Image source={require("../../../images/logo.jpeg")} style={{width:50,height:50,marginTop:13,marginLeft:5}}/>
       <Text style={{fontSize:28,fontWeight:'bold',marginTop:17,}}>CEPS</Text>
    </View>
   
  
    <Image source={require("../../../images/map.jpeg")} resizeMethod="contain" style={{width:40,height:40,marginTop:15,marginRight:20,}}/>
  
  
   
      </View>

<FlatList
	data={[{}]}
	renderItem={() =><>




<View style={{marginHorizontal:"6%"}}>
<FlatList
              data={datas}
              numColumns={2}
              keyExtractor={(item) => item.id}
              renderItem={({item, index}) => {
                return (
<View style={{width:'48%',marginLeft:5,marginBottom:8}}>
<Image source={item.image} style={{width:'98%',
  height:150,borderRadius:15}}/>
<Text numberOfLines={3} style={{justifyContent:'center',fontSize:12,marginLeft:4}}>{item.title}</Text>

</View>
                );
              }}
            />

</View>



</>}
    />
    </View>
  );
};
export default Ministries;

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
