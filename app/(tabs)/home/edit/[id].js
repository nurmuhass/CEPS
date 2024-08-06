import { View, Text, TouchableOpacity, Dimensions, FlatList,} from 'react-native'
import React, { useEffect } from 'react'
import { useRef, useState } from "react";
import { StatusBar } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Image } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Entypo from '@expo/vector-icons/Entypo';
import { TextInput } from 'react-native';
import { auth, db, storage } from '../../../../firebase-config';
import { addDoc, collection, getDoc, updateDoc } from 'firebase/firestore';
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { Alert } from 'react-native';

import Toast from '../../../../components/Toast';
import { data } from '../';
import { AuthStore } from '../../../../store';
import Loading from '../../../../components/Loading';
const CHARACTER_LIMIT = 300;

const edit = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const toastRef = useRef();
    const richText = useRef();
    const { id } = useLocalSearchParams();
    const user = auth.currentUser;
  
    const [Ministry, setMinistry] = useState();
    const [content, setContent] = useState('');
    const [header, setHeader] = useState('');
    const [displayContent, setDisplayContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [post, setPost] = useState(null);
    const [errors, setErrors] = useState({});
  
    useEffect(() => {
      getUser();
      fetchPost();
    }, []); 
  
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
      return () => unsubscribe();
    };
  
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost(postData);
          setContent(postData.content);
          setHeader(postData.header || ''); // Initialize with existing data
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
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
      setErrors(newErrors);
      return isValid;
    };
  
    const updatePost = async () => {
      if (!validate()) return;
      setLoading(true);
      try {
        const docRef = doc(db, "posts", id);
        await updateDoc(docRef, {
          content: content,
          updatedAt: new Date().toISOString(), // Add a timestamp if needed
        });
        setLoading(false);
        router.replace("/Success");
      } catch (error) {
        console.error('Error updating post in Firestore:', error);
        setLoading(false);
      }
    };
  
    if (loading) {
      return (
        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', zIndex: 99 }}>
          <Loading size={100} />
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
          <TouchableOpacity style={{ backgroundColor: '#f0f0f0', borderRadius: 5, width: 40, height: 38, alignItems: 'center', justifyContent: 'center', marginLeft: 20 }} onPress={handlePress}>
            <Ionicons name="chevron-back" size={28} color="#F93C65" />
          </TouchableOpacity>
  
          <Button title="Save" onPress={updatePost} buttonStyle={{ width: 80, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#F93C65' }} />
        </View>
  
        {userData && post ? (
          <>
            <RichEditor
              ref={richText}
              style={styles.richEditor}
              placeholder={userData.role === 'citizen' ? 'Write your complaint here...' : 'Write your post here...'}
              initialContentHTML={post.content}
              onChange={handleContentChange}
              useContainer={true}
              initialFocus={false}
            />
            <RichToolbar
              editor={richText}
              selectedIconTint="#873c1e"
              iconTint="#312921"
              actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, actions.insertBulletsList, actions.insertOrderedList]}
              style={styles.richToolbar}
            />
  
            <Text style={styles.characterCount}>
              {`${content.replace(/<[^>]*>?/gm, '').length}/${CHARACTER_LIMIT} characters`}
            </Text>
  
          </>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    );
  }

const styles = StyleSheet.create({
    richEditor: {
        flex: 1,

        borderRadius: 5,
        padding: 10,
        marginBottom: 0, // Space below for the toolbar
        
      },
      richToolbar: {
        position: 'absolute',
        bottom: '5%',
        left: 0,
        right: 0,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#d1d1d1',
        color:'#F93C65'
      },
      characterCount: {
        textAlign: 'right',
        marginTop: 10,
        fontSize: 14,
        color: '#F93C65',
      },
  });


export default edit