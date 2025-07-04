import { useRootNavigationState } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { AuthStore, initStore } from "../store";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Image } from "react-native";

const Index = () => {

  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { initialized, isLoggedIn } = AuthStore.useState();

  React.useEffect(() => {
    if (!navigationState?.key || !initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything
      //  segment is not anything in the auth group.
      !isLoggedIn &&
      !inAuthGroup
    ) {
      // Redirect to the login page.
      router.replace("/welcome");
    } else if (isLoggedIn) {
      // go to tabs root.
      router.replace("/(tabs)/home");
    }
  }, [segments, navigationState?.key, initialized]);

  return <View style={{flex:1,backgroundColor:'#fff'}}>
    {!navigationState?.key ? <Image source={require("../assets/images/splash.png")}
     style={{height:'100%',width:'100%'}}/> : <></>}</View>;
};
export default Index;
