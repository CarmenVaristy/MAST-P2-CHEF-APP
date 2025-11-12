// Menu.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";

// Define TypeScript type for navigation props to ensure type safety
type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Menu">;

// Define Meal interface to structure meal data throughout the application
type Meal = {
  name: string;           // Meal name for display
  price: number;          // Price as number for calculations
  desc: string;           // Description for meal details
  category: "Starters" | "Mains" | "Desserts"; // Restricted to three categories
};

// Define categories as tuple for TypeScript literal type preservation
const categories = ["All", "Starters", "Mains", "Desserts"] as const;

// Image mapping object to associate categories with their respective images
const images: Record<string, any[]> = {
  Starters: [require("../assets/starter1.png"), require("../assets/starter2.png")],
  Mains: [require("../assets/main1.png"), require("../assets/main2.png")],
  Desserts: [require("../assets/dessert1.png"), require("../assets/dessert2.png")],
};

// Color palette constants for consistent theming across components
const COLORS = {
  creamLight: 'rgba(250, 245, 235, 0.95)',
  creamMedium: 'rgba(242, 232, 215, 0.9)',
  creamDark: 'rgba(235, 220, 195, 0.85)',
  coffeeLight: 'rgba(165, 137, 107, 0.9)',
  coffeeMedium: 'rgba(139, 108, 77, 0.9)',
  coffeeDark: 'rgba(101, 67, 53, 0.9)',
  caramel: 'rgba(193, 125, 65, 0.9)',
  success: 'rgba(111, 168, 120, 0.9)',
  white: 'rgba(255, 255, 255, 0.98)',
};

const Menu: React.FC = () => {
  // Initialize navigation hook for screen transitions
  const navigation = useNavigation<MenuScreenNavigationProp>();
  
  // State for currently selected category filter
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("All");
  
  // State for menu data organized by categories
  const [proposedMenu, setProposedMenu] = useState<Record<string, Meal[]>>({
    Starters: [],  // Array for starter meals
    Mains: [],     // Array for main course meals
    Desserts: [],  // Array for dessert meals
  });
  
  // State for cart items to track user selections
  const [cartItems, setCartItems] = useState<any[]>([]);

  // useFocusEffect ensures data reloads every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          // Retrieve menu data from persistent storage
          const storedMenu = await AsyncStorage.getItem("proposedMenu");
          // Retrieve cart data from persistent storage
          const storedCart = await AsyncStorage.getItem("cartItems");

          // Update menu state with stored data or empty arrays as fallback
          setProposedMenu({
            Starters: storedMenu ? JSON.parse(storedMenu).Starters || [] : [],
            Mains: storedMenu ? JSON.parse(storedMenu).Mains || [] : [],
            Desserts: storedMenu ? JSON.parse(storedMenu).Desserts || [] : [],
          });

          // Update cart state with stored data or empty array as fallback
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
        } catch (err) {
          // Error handling for storage retrieval failures
          console.log("Data loading error:", err);
        }
      };
      // Execute data loading function
      loadData();
    }, []) // Empty dependency array ensures this runs on every focus
  );

  // Function to handle adding meals to the shopping cart
  const addToCart = async (category: keyof typeof proposedMenu, index: number) => {
    // Retrieve specific meal from proposed menu based on category and index
    const meal = proposedMenu[category][index];
    if (meal) {
      // Generate unique ID for cart item using name and timestamp
      const id = `${meal.name}-${Date.now()}`;
      // Create updated cart array with new item
      const updatedCart = [
        ...cartItems,
        { ...meal, id, quantity: 1, price: Number(meal.price) || 0, category },
      ];
      // Update cart state with new item
      setCartItems(updatedCart);
      // Persist updated cart to storage
      await AsyncStorage.setItem("cartItems", JSON.stringify(updatedCart));
      
      // Show success alert to user
      Alert.alert(
        "🎉 Added to Cart!",
        `${meal.name} has been added to your order!`,
        [{ text: "Awesome! 👌" }]
      );
    }
  };

  // Filter function to determine which meals to display based on selected category
  const filteredMeals = (category: keyof typeof proposedMenu) => {
    if (selectedCategory === "All") return proposedMenu[category] || [];
    if (selectedCategory === category) return proposedMenu[category] || [];
    return []; // Return empty array if category doesn't match filter
  };

  // Helper function to get appropriate icon for each category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Starters": return "🥗";
      case "Mains": return "🍝";
      case "Desserts": return "🍰";
      default: return "🍽️";
    }
  };

  // Helper function to get category-specific background colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Starters": return 'rgba(111, 168, 120, 0.9)'; // Green for starters
      case "Mains": return 'rgba(193, 125, 65, 0.9)';    // Caramel for mains
      case "Desserts": return 'rgba(165, 105, 189, 0.9)'; // Purple for desserts
      default: return COLORS.caramel;
    }
  };

  // Define column structure for three-category layout
  const columns = ["Starters", "Mains", "Desserts"] as const;

  return (
    // Background image container for visual theme
    <ImageBackground
      source={require("../assets/MENU.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Scrollable content container */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.restaurantName}>Christoffel</Text>
            <Text style={styles.menuTitle}>THE MENU</Text>
            <Text style={styles.tagline}>Culinary Excellence on Every Plate</Text>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            {/* Navigation button to menu management screen */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate("MenuAddItem")}
            >
              <Text style={styles.backBtnText}>← Manage Menu</Text>
            </TouchableOpacity>

            {/* Cart button with item count badge */}
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => navigation.navigate("Cart")}
            >
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{cartItems.length}</Text>
              </View>
              <Text style={styles.cartBtnText}>🛒 View Cart</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY FILTERS */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                selectedCategory === cat && styles.categoryBtnActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryBtnText,
                selectedCategory === cat && styles.categoryBtnTextActive
              ]}>
                {cat === "All" ? "🛒 All" : `${getCategoryIcon(cat)} ${cat}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MENU COLUMNS - Three-column layout for categories */}
        <View style={styles.menuColumns}>
          {columns.map((category) => {
            // Get filtered meals for current category
            const meals = filteredMeals(category);
            const mealCount = meals.length;
            // Calculate price range for category statistics
            const prices = meals.map((m) => Number(m.price) || 0);
            const priceRange = mealCount > 0 ? Math.max(...prices) - Math.min(...prices) : 0;

            return (
              <View key={category} style={styles.column}>
                {/* COLUMN HEADER with category-specific coloring */}
                <View style={[styles.columnHeader, { backgroundColor: getCategoryColor(category) }]}>
                  <Text style={styles.columnIcon}>{getCategoryIcon(category)}</Text>
                  <Text style={styles.columnTitle}>{category.toUpperCase()}</Text>
                  <Text style={styles.columnCount}>{mealCount} items</Text>
                </View>

                {/* PRICE RANGE DISPLAY */}
                {mealCount > 0 && (
                  <View style={styles.priceRange}>
                    <Text style={styles.priceRangeText}>
                      Price Range: R{priceRange.toFixed(2)}
                    </Text>
                  </View>
                )}

                {/* EMPTY STATE for categories with no meals */}
                {mealCount === 0 && (
                  <View style={styles.emptyColumn}>
                    <Text style={styles.emptyIcon}>{getCategoryIcon(category)}</Text>
                    <Text style={styles.emptyText}>No {category.toLowerCase()} yet</Text>
                    <Text style={styles.emptySubtext}>Add some delicious options!</Text>
                  </View>
                )}

                {/* MEAL CARDS - Individual meal display */}
                {meals.map((meal, index) => (
                  <View
                    key={index}
                    style={styles.mealCard}
                  >
                    {/* MEAL IMAGE */}
                    <Image
                      source={images[category][index] || images[category][0]}
                      style={styles.mealImage}
                    />
                    
                    {/* MEAL INFORMATION */}
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealDescription}>{meal.desc}</Text>
                      
                      {/* PRICE DISPLAY - Separate from button */}
                      <View style={styles.mealFooter}>
                        <Text style={styles.mealPrice}>
                          R{Number(meal.price || 0).toFixed(2)}
                        </Text>
                      </View>
                      
                      {/* ADD TO CART BUTTON - Positioned below price */}
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(category, index)}
                      >
                        <Text style={styles.addButtonText}>+ Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* BOTTOM SPACER for scroll view padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ImageBackground>
  );
};

export default Menu;

// Get device dimensions for responsive design calculations
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: "100%", 
    height: "100%" 
  },
  scrollContainer: { 
    flexGrow: 1, // Allows scroll view to expand with content
    padding: 20,
    paddingBottom: 40, // Extra bottom padding for scroll space
  },
  header: {
    backgroundColor: COLORS.creamMedium,
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12, // Android shadow property
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: "300", // Light weight for elegant appearance
    color: COLORS.coffeeDark,
    marginBottom: 5,
    textAlign: 'center',
  },
  menuTitle: {
    fontSize: 36,
    fontWeight: "800", // Extra bold for emphasis
    color: COLORS.caramel,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(101, 67, 53, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.coffeeMedium,
    fontStyle: 'italic', // Italic for stylistic emphasis
    textAlign: 'center',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: COLORS.creamDark,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.coffeeLight,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backBtnText: {
    color: COLORS.coffeeDark,
    fontWeight: "700",
    fontSize: 14,
  },
  cartBtn: {
    backgroundColor: COLORS.caramel,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cartBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cartCount: {
    color: COLORS.caramel,
    fontWeight: '800',
    fontSize: 12,
  },
  cartBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping on small screens
    justifyContent: "center",
    marginBottom: 25,
    gap: 12, // Modern gap property for consistent spacing
  },
  categoryBtn: { 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20, 
    backgroundColor: COLORS.creamDark,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  categoryBtnActive: { 
    backgroundColor: COLORS.caramel,
    borderColor: COLORS.coffeeLight,
    transform: [{ scale: 1.05 }], // Scale effect for active state
  },
  categoryBtnText: { 
    color: COLORS.coffeeDark, 
    fontWeight: "600",
    fontSize: 14,
  },
  categoryBtnTextActive: { 
    color: COLORS.white,
    fontWeight: "700",
  },
  menuColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15, // Consistent gap between columns
  },
  column: {
    flex: 1, // Equal width for all columns
    minHeight: 400, // Minimum height to prevent layout shifts
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  columnIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: 'center',
  },
  columnCount: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
    opacity: 0.9, // Slight transparency for secondary information
  },
  priceRange: {
    backgroundColor: COLORS.creamLight,
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  priceRangeText: {
    fontSize: 12,
    color: COLORS.coffeeDark,
    fontWeight: '600',
  },
  emptyColumn: {
    backgroundColor: COLORS.creamMedium,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150, // Minimum height for empty state
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
    opacity: 0.6, // Reduced opacity for empty state icons
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.coffeeMedium,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
    color: COLORS.coffeeLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mealCard: {
    backgroundColor: COLORS.creamMedium,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mealImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    marginBottom: 12,
  },
  mealInfo: {
    flex: 1, // Take remaining space in card
  },
  mealName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.coffeeDark,
    marginBottom: 6,
    textAlign: 'center',
  },
  mealDescription: {
    fontSize: 13,
    color: COLORS.coffeeMedium,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
    lineHeight: 16, // Improved readability for multi-line descriptions
  },
  mealFooter: {
    marginBottom: 8, // Space between price and button
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.caramel,
    textAlign: 'center',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: COLORS.caramel,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignSelf: 'center', // Center button within container
    width: '100%', // Full width of parent container
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20, // Additional bottom spacing for scroll view
  },
});