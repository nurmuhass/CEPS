import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const Loader = ({size="large",color='#F93C65'}) => {
  return (
    <View>
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

export default Loader