import { SplashScreen, Stack } from "expo-router";


import {
  useFonts,
  EncodeSansSemiCondensed_100Thin,
  EncodeSansSemiCondensed_200ExtraLight,
  EncodeSansSemiCondensed_300Light,
  EncodeSansSemiCondensed_400Regular,
  EncodeSansSemiCondensed_500Medium,
  EncodeSansSemiCondensed_600SemiBold,
  EncodeSansSemiCondensed_700Bold,
  EncodeSansSemiCondensed_800ExtraBold,
  EncodeSansSemiCondensed_900Black,
} from '@expo-google-fonts/encode-sans-semi-condensed';
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {

  const [fontsLoaded] = useFonts({
    EncodeSansSemiCondensed_700Bold,
    EncodeSansSemiCondensed_400Regular,
    EncodeSansSemiCondensed_300Light,
    EncodeSansSemiCondensed_100Thin
  });

  if (!fontsLoaded) {
    // The native splash screen will stay visible for as long as there
    // are `<SplashScreen />` components mounted. This component can be nested.

    return <Text> Loading</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

<Stack screenOptions={{ headerShown: false }}  />
    </GestureHandlerRootView>


  );
}
