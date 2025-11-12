// AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ----------------------------
// SCREENS
// ----------------------------
import Home from "../screens/Home";
import Menu from "../screens/Menu";
import MenuAddItem from "../screens/MenuAddItem";
import Cart from "../screens/Cart";
import Checkout from "../screens/Checkout";

// ----------------------------
// STACK PARAM TYPES
// ----------------------------
export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  MenuAddItem: undefined;
  Cart: undefined;
  Checkout: { 
    cartItems: Array<{ name: string; price: number; quantity: number }>; 
    promoCode?: string;
  };
};

// ----------------------------
// STACK NAVIGATOR
// ----------------------------
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Hide default header, optional
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="MenuAddItem" component={MenuAddItem} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Checkout" component={Checkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
