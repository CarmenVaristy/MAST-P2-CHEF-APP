// App.tsx
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screen components from screens directory
import Home from "./screens/Home";
import Menu from "./screens/Menu";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import MenuAddItem from "./screens/MenuAddItem";

// Define TypeScript types for navigation parameters between screens
export type RootStackParamList = {
  Home: undefined;                    // Home screen requires no parameters
  Menu: undefined;                    // Menu screen requires no parameters  
  Cart: undefined;                    // Cart screen requires no parameters
  Checkout: {                         // Checkout screen requires cart items array
    cartItems: { 
      name: string; 
      price: number; 
      quantity: number;
      category?: string;
      id?: string;
    }[]; 
    promoCode?: string;               // Optional promo code parameter
  };
  MenuAddItem: undefined;             // Menu management screen requires no parameters
};

// Create stack navigator instance for screen management
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  // Effect hook to clear cart storage when app starts fresh
  useEffect(() => {
    const resetCartOnStart = async () => {
      try {
        // Remove cart items from persistent storage to start fresh session
        await AsyncStorage.removeItem('cartItems');
        console.log("Cart reset on app start - new session initialized");
      } catch (error) {
        // Error handling for storage operations
        console.log("Storage error during cart reset:", error);
      }
    };
    
    // Execute cart reset function on component mount
    resetCartOnStart();
  }, []); // Empty dependency array ensures this runs only once on app start

  return (
    // NavigationContainer is the root component for navigation management
    <NavigationContainer>
      {/* Stack.Navigator manages the screen stack with no headers shown */}
      <Stack.Navigator
        initialRouteName="Home"         // Set Home as the first screen
        screenOptions={{ headerShown: false }} // Hide default navigation headers
      >
        {/* Define all navigable screens with their components */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="MenuAddItem" component={MenuAddItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;