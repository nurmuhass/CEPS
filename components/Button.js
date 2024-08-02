import { Text, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../constants/Styles';


const Button = (props) => {
    const filledBgColor = props.color || '#1F41BB';
    const outlinedColor = "#fff";
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? "#fff" : '#1F41BB';


    const isLoading = props.isLoading || false
    return (
        <TouchableOpacity 
        onPress={props.onPress}
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style
            }}
        >
           {isLoading && isLoading == true ? (
             <ActivityIndicator size="small" color={colors.white} />
         ) : (
             <Text
                 style={{
                     ...{ color: textColor },
                 }}
             >
                 {props.title}
             </Text>
         )}
        </TouchableOpacity>
    
       
    )
}

const styles = StyleSheet.create({
    button: {
        paddingBottom: 16,
        paddingVertical: 10,
        borderColor: '#1F41BB',
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Button