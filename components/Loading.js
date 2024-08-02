import { View, Text } from 'react-native'
import React from 'react'
import { MotiView } from '@motify/components';

    
const Loading = ({size}) =>{
    return(
  <MotiView
  from={{
  width:size,
  height:size,
  borderRadius:size/2,
  borderWidth:0,
  shadowOpacity:0,
  }}
  animate={{
    width:size + 20,
    height:size + 20,
    borderRadius:(size + 20) /2,
    borderWidth:size/10,
    shadowOpacity:1
  }}
  
  transition={{
    type:'timing',
    duration:1000,
    loop:true,
    repeatReverse:false,
  }}
  style={{
    width:size,
    height:size,
    borderRadius: size/2,
    borderWidth:size/10,
    borderColor:"#010100",
 
  }}
  />
  )
}

export default Loading