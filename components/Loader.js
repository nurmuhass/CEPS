import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const Loader = ({size="large",color='#00C26F'}) => {
  return (
    <View>
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

export default Loader