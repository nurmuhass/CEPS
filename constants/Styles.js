import { Dimensions } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { height, width } = Dimensions.get('window')



export const colors = {
    buttons:"#ff8c52",
    grey1: '#43484d',
    grey2: '#5e6977',
    grey3: '#86939e',
    grey4: '#bdc6cf',
    grey5: '#e1e8ee',
    CardComment : '#86939e',
    cardbackground:"fff",
    statusbar:"#ff8c52",
    heaherText:"white",
    lightgreen: '#66DF48',
    darkText: "#626262",
    text: "#000",
    background: "#fff",
    primary: '#1F41BB',
    onPrimary: "#fff",
    active: '#1F41BB',
    borderWithOpacity: "#1f41bb",
    lightPrimary: "#f1f4ff",
    gray: "#ECECEC",
}


export const parameters ={
  headerHeight :40,
  statusBarHeight :getStatusBarHeight(),
  styledButton:{
      backgroundColor:"#ff8c52",
      alignContent:"center",
      justifyContent:"center",
      borderRadius:12,
      borderWidth:1, 
      borderColor:"#ff8c52",
      height:50,
      paddingHorizontal:20,
      width:'100%'
  },

  buttonTitle:{
      color:"white",
      fontSize:20,  
      fontWeight:"bold" ,
      alignItems:"center",
      justifyContent:"center"  ,
      marginTop:-3 
  }
}