import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react' 
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Link } from 'expo-router';

const ComplainBox = ({Title,date,image,images,id}) => {
  return (
    <View style={{backgroundColor:'#fff',width:'94%',padding:15,borderRadius:10,marginBottom:12,
    marginLeft:'3%',marginRight:'3%'}}>
      <View style={{flexDirection:"row",}}>
        
      {images.length === 0 ? (
  <Image source={require("../images/DefaultImage.jpg")} style={{width:70,height:90,borderRadius:8}}/>
) : (
  <Image source={{uri: images[0]}} style={{width:70,height:90,borderRadius:8,borderWidth:0.8,borderColor:'#e1e8ee'}}/>
)}
           
            <View style={{justifyContent:'center',marginLeft:10,width:'80%',}}>
<Text style={{fontSize:18,fontWeight:"700",flexWrap: 'wrap',lineHeight:20,paddingRight:20}} numberOfLines={3}>{Title}</Text>

<Text>{date}</Text>
            </View>
      </View>

<View style={{borderTopWidth:1,borderColor:'#f0f0f0',marginTop:10,}}>

<View style={{marginTop:8,flexDirection:'row',justifyContent:'space-between'}}>

  <View style={{flexDirection:'row',alignItems:'center'}}>
      
      <AntDesign name="edit" size={18} color="black" />
      <Link href={`../(tabs)/home/edit/${id}`} asChild>
      <TouchableOpacity>
           <Text style={{marginLeft:2}}>Edit</Text>
      </TouchableOpacity>
      </Link>
  </View>
  
  <View style={{flexDirection:'row'}}>
      <AntDesign name="eyeo" size={18} color="black" />
      <Link href={`../(tabs)/home/view/${id}`} asChild>
      <TouchableOpacity>
           <Text style={{marginLeft:2}}>View</Text>
      </TouchableOpacity>
      </Link>
      {/* <Link href={`/SingUpDoctorsPage/${id}/verify`}> */}
  </View>


<View style={{flexDirection:'row'}}>
<AntDesign name="delete" size={18} color="black" />
    <Text style={{marginLeft:2}}>Delete</Text>
</View>

</View>

</View>

    </View>
  )
}

export default ComplainBox