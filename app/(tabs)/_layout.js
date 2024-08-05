import { Tabs } from "expo-router";
import { Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:'#F93C65',
        tabBarLabelStyle:{fontWeight:'bold',textTransform:'capitalize'},
        tabBarIconStyle:{backgroundColor:'#F93C65',color:'#F93C65'},
     
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
        }}
    
    />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: () => <Ionicons name="apps-outline" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarIcon: () => <MaterialIcons name="add-box" size={24} color="black" />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <AntDesign name="user" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
