import { Stack } from "expo-router";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import {ParamListBase,TabNavigationState} from "@react-navigation/native"
import { withLayoutContext } from "expo-router";

 const {Navigator} = createMaterialTopTabNavigator();

 export const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions,typeof Navigator,TabNavigationState<ParamListBase>,
 MaterialTopTabNavigationEventMap>(Navigator);

export default function Layout() {
  return (
<>

<MaterialTopTabs style={{marginTop:40}}  screenOptions={{
        tabBarActiveTintColor:'#F93C65',
        
        tabBarIndicatorStyle:{backgroundColor:'#F93C65'}
      }}>
    <MaterialTopTabs.Screen name="index" options={{title:'Ministries'}} />
    <MaterialTopTabs.Screen name="Timeline" options={{title:'Time line'}} />
  </MaterialTopTabs>
</>

 
  );
}
