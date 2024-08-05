import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useEffect, useState } from "react";

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



const renderItem = ({ item }) => (
  <View style={styles.postContainer}>
    <View style={styles.headerContainer}>
      <Image
        source={require("../../../images/user.jpg")}
        style={styles.profileImage}
      />
      <View style={styles.headerTextContainer}>
        <View style={styles.headerText}>
          <Text style={styles.username}>{item.ministry}</Text>
          <Text style={styles.timestamp}>{item.time}</Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </View>
    {item.hasImage && (
      <Image source={item.imageUrl} style={styles.postImage} />
    )}
    <View style={styles.actionsContainer}>
      <AntDesign name="hearto" size={20} color="black" />
      <AntDesign name="sharealt" size={20} color="black" />
      <Ionicons name="stats-chart-outline" size={20} color="black" />
    </View>
  </View>
);


export default function TimeLine() {
  const router = useRouter();
const [timeline,setTimeline]=useState(null)
const [loading, setLoading] = useState(false);
  const getTimeline = async () => {
    try {
      setLoading(true); // Start loading

      const list = [];

      const unsubscribe = onSnapshot(collection(db, "timeline"), (querySnapshot) => {
        list.length = 0; // Clear the list to prevent duplicates
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setTimeline(list);
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
    const unsubscribe = getTimeline();

    // Clean up the subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <View>


 <FlatList
      data={posts}
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
    marginTop: 3,
  },
});
