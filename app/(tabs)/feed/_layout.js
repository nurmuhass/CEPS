// import { Stack } from "expo-router";
// import {
//   createMaterialTopTabNavigator,
//   MaterialTopTabNavigationOptions,
//   MaterialTopTabNavigationEventMap,
// } from "@react-navigation/material-top-tabs";
// import {ParamListBase,TabNavigationState} from "@react-navigation/native"
// import { withLayoutContext } from "expo-router";

//  const {Navigator} = createMaterialTopTabNavigator();

//  export const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions,typeof Navigator,TabNavigationState<ParamListBase>,
//  MaterialTopTabNavigationEventMap>(Navigator);

// export default function Layout() {
//   return (

// <MaterialTopTabs style={{marginTop:40}}  screenOptions={{
//         tabBarActiveTintColor:'#F93C65',
//         tabBarIndicatorStyle:{backgroundColor:'#F93C65'}
//       }}>
//     <MaterialTopTabs.Screen name="index" options={{title:'Ministries'}} />
//     <MaterialTopTabs.Screen name="Timeline" options={{title:'Time line'}} />
//   </MaterialTopTabs>

 
//   );
// }

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import  TimeLine  from './Timeline'
import Ministries from './ministries'

const Tab = createMaterialTopTabNavigator();

function IndexScreen() {
  return (
    <View style={styles.container}>
      <Ministries/>
    </View>
  );
}

function TimelineScreen() {
  return (
    <View style={styles.container}>
     <TimeLine/>
    </View>
  );
}

export default function Layout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#F93C65',
        tabBarIndicatorStyle: { backgroundColor: '#F93C65' },
        tabBarStyle: { marginTop: 40 },
      }}
    >
      <Tab.Screen name="index" component={IndexScreen} options={{ title: 'Ministries' }} />
      <Tab.Screen name="Timeline" component={TimelineScreen} options={{ title: 'Timeline' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});

