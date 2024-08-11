import { View, Text, TouchableOpacity, Dimensions, FlatList,} from 'react-native'
import React, { useEffect } from 'react'
import { useRef, useState } from "react";
import { StatusBar } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useRouter } from 'expo-router';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Image } from 'react-native';
import { data } from './(tabs)/home';
import {Picker} from '@react-native-picker/picker';
import Entypo from '@expo/vector-icons/Entypo';
import { TextInput } from 'react-native';
import { auth, db, storage } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { Alert } from 'react-native';
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { AuthStore } from '../store';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { datas } from './(tabs)/feed';

const CHARACTER_LIMIT = 300;

const PostComplain = () => {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [Ministry, setMinistry] = useState();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');
  const [displayContent, setDisplayContent] = useState('');
  const [loading, setLoading] = useState(false);
  const toastRef = useRef();
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const richText = useRef();

  const user = auth.currentUser;
  const role = AuthStore.getRawState().role; // Adjust as needed

  const getUser = async () => {
    const docRef = doc(db, 'users', user.uid);

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

  useEffect(() => {
    getUser();
  }, []); // Empty dependency array means this runs once when the component mounts

  const pickImages = async () => {
    setIsLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 4,
      });
      if (!result.canceled) {
        setImages(result.assets.map(asset => ({ uri: asset.uri })));
      }
    } catch (error) {
      console.error("Error picking images: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    router.replace("/(tabs)/home");
  };

  const handleContentChange = (html) => {
    const textContent = html.replace(/<[^>]*>?/gm, '');
    if (textContent.length <= CHARACTER_LIMIT) {
      setContent(html);
      setDisplayContent(html);
    } else {
      richText.current?.setContentHTML(displayContent);
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(); // e.g., "8/1/2024"
  const formattedTime = currentDate.toLocaleTimeString(); // e.g., "3:37:30 PM"

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!content) {
      newErrors.content = 'Please type a Content';
      toastRef.current.show({
        type: 'error',
        text: "Please type a Content",
        duration: 2000,
      });
      isValid = false;
    }
    
    if (userData?.role === 'citizen') {
      if (!Ministry) {
        newErrors.Ministry = 'Please select Ministry';
        toastRef.current.show({
          type: 'error',
          text: "Please select Ministry",
          duration: 2000,
        });
        isValid = false;
      }
      if (!header) {
        newErrors.header = 'Please Enter Header';
        toastRef.current.show({
          type: 'error',
          text: "Please Enter Header",
          duration: 2000,
        });
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];

    setUploading(true);
    const imageUrls = [];

    for (let image of images) {
      const uploadUri = image.uri;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = `${name}_${Date.now()}.${extension}`;
      let storageRef;

      if (userData?.role === 'citizen') {
        storageRef = ref(storage, `images/${filename}`);
      } else {
        storageRef = ref(storage, `timeline_images/${filename}`);
      }

      const img = await fetch(uploadUri);
      const bytes = await img.blob();

      try {
        await uploadBytes(storageRef, bytes);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      } catch (e) {
        console.error('Image upload error:', e);
      }
    }

    setUploading(false);
    return imageUrls;
  };

  const submitPost = async () => {
    if (!validate()) return;

    setLoading(true);
    const imageUrls = await uploadImages();

    try {
      if (userData?.role === 'citizen') {
        await addDoc(collection(db, "posts"), {
          userId: user.uid,
          header: header,
          Ministry: Ministry,
          content: content,
          postTime: formattedDate + ' ' + formattedTime,
          images: imageUrls.length === 0 ? null : imageUrls,
          hasImage: imageUrls.length === 0 ? false : true,
          status:'pending',
        });
      } else {
        await addDoc(collection(db, "timeline"), {
          userId: user.uid,
          Ministry: userData.fullname,
          content: content,
          postTime: formattedDate + ' ' + formattedTime,
          images: imageUrls.length === 0 ? null : imageUrls,
          hasImage: imageUrls.length === 0 ? false : true,
          likesCount:0,
        });
      }

      setLoading(false);
      router.replace("/Success");

      setHeader('');
      setContent('');
      setImages([]);
      setMinistry('');
    } catch (error) {
      console.error('Error adding post to Firestore:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', zIndex: 99 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 3, backgroundColor: '#ffffff', paddingTop: getStatusBarHeight() }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(255, 255, 255, 0)"
      />
      <Toast ref={toastRef} topValue={80} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#f0f0f0', borderRadius: 5, width: 40, height: 38, alignItems: 'center', justifyContent: 'center', marginLeft: 20 }}
          onPress={handlePress}
        >
          <Ionicons name="chevron-back" size={28} color="#F93C65" />
        </TouchableOpacity>
        <Button title="Save" onPress={submitPost} buttonStyle={{ width: 80, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#F93C65' }} />
      </View>
      <RichEditor
        ref={richText}
        style={styles.richEditor}
        placeholder={
          userData?.role === 'citizen' ? 'Write your complaint here...' :
          userData?.role === 'ministry' ? 'Write your post here...' :
          'Write your post here...'
        }
        initialContentHTML=""
        onChange={handleContentChange}
        useContainer={true}
        initialFocus={false}
      />
      <RichToolbar
        editor={richText}
        selectedIconTint="#873c1e"
        iconTint="#312921"
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.insertBulletsList,
          actions.insertOrderedList,
        ]}
        style={styles.richToolbar}
      />
      <Text style={styles.characterCount}>
        {`${content.replace(/<[^>]*>?/gm, '').length}/${CHARACTER_LIMIT} characters`}
      </Text>
      <View style={{ marginTop: userData?.role === 'citizen' ? 90 : 20 }}>
        {userData?.role === 'citizen' && (
          <TextInput
            placeholder="Enter a title..."
            value={header}
            onChangeText={(text) => setHeader(text)}
            style={{ width: '96%', marginBottom: 20, borderBottomWidth: 1, paddingLeft: 20, fontSize: 18, marginTop: 30, marginLeft: "2%", marginRight: "2%", borderBottomColor: '#555' }}
          />
        )}
        {userData?.role === 'citizen' && (
          <Picker
            selectedValue={Ministry}
            onValueChange={(itemValue) => setMinistry(itemValue)}
            style={{ borderWidth: 2, borderColor: "white", color: 'white', width: "95%", margin: 10, borderRadius: 8, backgroundColor: '#F93C65', marginTop: 0 }}
          >
            <Picker.Item label="Choose Ministry" value="Choose Ministry" disabled />
            {datas.map((item, index) => (
              <Picker.Item label={item.title} value={item.title} key={item.id} />
            ))}
          </Picker>
        )}
        <View>
          <Entypo name="image" size={24} color="white" style={{ position: 'absolute', marginLeft: '30%', zIndex: 99, top: 13 }} />
          <Button title="Pick images" onPress={pickImages} buttonStyle={{ backgroundColor: '#F93C65', color: 'white', width: '97', marginHorizontal: '3%', height: 50 }} />
        </View>
      </View>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={{ width: 100, height: 100, margin: 5 }}
          />
        )}
        numColumns={4}
        keyExtractor={(item) => item.uri}
        contentContainerStyle={{ marginVertical: 10, paddingBottom: 50, position: 'absolute', bottom: 10 }}
        ListHeaderComponent={
          isLoading ? (
            <View>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <></>
          )
        }
      />
    </View>
  );
};




const styles = StyleSheet.create({
    richEditor: {
        flex: 1,
        maxHeight: Dimensions.get('window').height / 2, // Limit the height to half of the screen height
        borderRadius: 5,
        padding: 10,
        marginBottom: 0, // Space below for the toolbar
        
      },
      richToolbar: {
        position: 'absolute',
        bottom: '50%',
        left: 0,
        right: 0,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#d1d1d1',
      },
      characterCount: {
        textAlign: 'right',
        marginTop: 10,
        fontSize: 14,
        color: '#555',
      },
  });




export default PostComplain