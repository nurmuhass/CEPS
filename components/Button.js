import { Text, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../constants/Styles';


const Button = (props) => {
    const filledBgColor = props.color || '#F93C65';
    const outlinedColor = "#fff";
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? "#fff" : '#F93C65';


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
        borderColor: '#F93C65',
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Button