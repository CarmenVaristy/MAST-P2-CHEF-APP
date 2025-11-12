// Home.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App"; // Import navigation type definitions

// ----------------------------
// TYPE DEFINITIONS
// Define TypeScript type for navigation props to ensure type safety
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,  // Root navigation parameter list
  "Home"               // Specific screen name for type checking
>;

// ----------------------------
// COMPONENT IMPLEMENTATION
// Main Home component functional definition
const Home: React.FC = () => {
  // Initialize navigation hook for programmatic screen transitions
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    // Main container view that fills entire screen
    <View style={styles.container}>
      {/* Background image component for visual appeal */}
      <ImageBackground
        source={require("../assets/HOMEPAGE.png")} // Load background image from assets
        style={styles.background}                   // Apply full-screen styling
        resizeMode="cover"                          // Scale image to cover entire container
      >
        {/* ADMIN BUTTON CONTAINER - Positioned top-right for menu management access */}
        <View style={styles.topRightButtonContainer}>
          <TouchableOpacity
            style={styles.topRightButton}
            // Navigate to MenuAddItem screen for menu creation/filtering
            onPress={() => navigation.navigate("MenuAddItem")}
          >
            <Text style={styles.topRightButtonText}>Create/Filter Menu</Text>
          </TouchableOpacity>
        </View>

        {/* SHOP INFORMATION CONTAINER - Centered content with restaurant details */}
        <View style={styles.shopInfoContainer}>
          {/* Restaurant name display with elegant typography */}
          <Text style={styles.shopName}>Christoffel</Text>
          
          {/* Main menu title with prominent styling */}
          <Text style={styles.menuTitle}>MENU</Text>
          
          {/* Tagline describing restaurant concept */}
          <Text style={styles.tagline}>Delicious treats, anytime, anywhere</Text>
          
          {/* Promotional offer to attract customer attention */}
          <Text style={styles.specialOffer}>
            This Week's Special - 20% Off All Mains
          </Text>

          {/* PRIMARY CALL-TO-ACTION BUTTON - Navigates to main menu */}
          <TouchableOpacity
            style={styles.viewMenuButton}
            // Navigate to Menu screen to browse all offerings
            onPress={() => navigation.navigate("Menu")}
          >
            <Text style={styles.viewMenuButtonText}>View Full Menu</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;

// ----------------------------
// STYLE DEFINITIONS
// Get device dimensions for responsive design calculations
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Main container style - fills entire screen space
  container: { 
    flex: 1  // Take all available space in parent container
  },
  
  // Background image style - covers entire screen
  background: { 
    flex: 1,    // Expand to fill container
    width,      // Use full device width
    height      // Use full device height
  },
  
  // Admin button container - positioned absolutely in top-right corner
  topRightButtonContainer: {
    position: "absolute", // Position independently of other elements
    top: 40,              // Distance from top of screen (status bar consideration)
    right: 20,            // Distance from right edge of screen
    zIndex: 5,            // Ensure button appears above background content
  },
  
  // Admin button styling - semi-transparent dark background
  topRightButton: {
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black
    paddingVertical: 6,                  // Vertical padding for touch target
    paddingHorizontal: 12,               // Horizontal padding for text spacing
    borderRadius: 8,                     // Rounded corners for modern appearance
  },
  
  // Admin button text styling - white text for contrast
  topRightButtonText: {
    color: "#fff",        // White text color
    fontWeight: "600",    // Semi-bold font weight
    fontSize: 16,         // Readable font size
    textAlign: "center",  // Center text within button
  },
  
  // Shop information container - centered content overlay
  shopInfoContainer: {
    position: "absolute",   // Position over background image
    top: 80,                // Distance from top (below admin button)
    width: "100%",          // Full width for centering content
    alignItems: "center",   // Center child elements horizontally
    paddingHorizontal: 10,  // Horizontal padding for edge spacing
  },
  
  // Restaurant name styling - elegant and prominent
  shopName: {
    fontSize: 50,           // Large font size for brand prominence
    fontWeight: "300",      // Light font weight for sophistication
    color: "#fff",          // White text for contrast against background
  },
  
  // Menu title styling - bold and attention-grabbing
  menuTitle: {
    fontSize: 60,           // Very large font size for emphasis
    fontWeight: "700",      // Bold font weight for impact
    color: "#FF6347",       // Tomato red color for visual appeal
    marginTop: 4,           // Small top margin for spacing
  },
  
  // Tagline styling - descriptive and inviting
  tagline: {
    fontSize: 16,           // Standard readable size
    color: "#D2B48C",       // Tan color for subtle contrast
    marginTop: 12,          // Top margin for separation from title
  },
  
  // Special offer styling - promotional and eye-catching
  specialOffer: {
    fontSize: 18,           // Slightly larger for importance
    color: "#FFD700",       // Gold color for special offer emphasis
    fontWeight: "700",      // Bold weight for prominence
    marginTop: 8,           // Top margin for visual separation
  },
  
  // View menu button styling - primary call-to-action
  viewMenuButton: {
    marginTop: 20,          // Top margin for separation from text
    backgroundColor: "#556b2f", // Dark olive green background
    paddingVertical: 12,    // Generous vertical padding for touch target
    paddingHorizontal: 24,  // Horizontal padding for button width
    borderRadius: 8,        // Rounded corners for modern appearance
  },
  
  // View menu button text styling - clear and readable
  viewMenuButtonText: {
    color: "#fff",          // White text for contrast
    fontWeight: "600",      // Semi-bold for emphasis
    fontSize: 16,           // Standard readable size
    textAlign: "center",    // Center text within button
  },
});