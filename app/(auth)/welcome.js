import { Text, View, TextInput, StyleSheet, Image } from "react-native";
import AnimatedIntro from "../../components/AnimatedIntro";
import BottomLoginSheet from "../../components/BottomLoginSheet";
import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import { ImageBackground } from "react-native";
import { Dimensions } from "react-native";
const { height } = Dimensions.get("window");
export default function Index() {
return (
<View style={{ flex: 1,backgroundColor:'#ffffff' }}>
    <StatusBar
      translucent
      barStyle="dark-content"
      backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
  />
  <View style={{marginLeft:15 }}>
    
  
      {/* <AnimatedIntro />
      <BottomLoginSheet /> */}




  
  <View style={{marginTop:50,alignItems:'center'}}>
      <Image source={require("../../images/map.jpeg")} style={{width:80,height:70}}/>
  </View>


  <View style={{marginTop:20,alignItems:'center',marginBottom:30}}>
    <Text style={{fontSize:30,fontWeight:'bold'}}>Welcome to</Text>
    <Text style={{marginTop:5,color:'#555',fontSize:17,}}> Citizen Engagement Platform System</Text>
  </View>

  <ImageBackground
          style={{
            height: height / 2.5,
          }}
          resizeMode="contain"
          source={require("../../images/report.jpg")}
        />
  
  <Text
            style={{
             marginTop:5,
             color:'#555',
             fontSize:17,
              textAlign: "center",
              marginTop: 10 * 2,
            }}
          >
         Empower your community, report to the government and shape a brighter future together!
          </Text>

  </View>
  <BottomLoginSheet />
    </View>
  );
}
