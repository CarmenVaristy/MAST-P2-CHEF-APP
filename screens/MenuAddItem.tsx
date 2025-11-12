// MenuAddItem.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";

// Define TypeScript type for navigation props with strict type checking
type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MenuAddItem">;

// Define Meal interface to structure meal data for menu management
type Meal = {
  name: string;     // Display name of the meal
  desc: string;     // Description for meal details
  price: string;    // Price as string for input flexibility
  image: any;       // Image reference for visual representation
};

// Define MenuData interface to structure categorized menu data
type MenuData = {
  Starters: Meal[];  // Array of starter meals
  Mains: Meal[];     // Array of main course meals
  Desserts: Meal[];  // Array of dessert meals
};

// Define categories as array of keys from MenuData for type safety
const categories: (keyof MenuData)[] = ["Starters", "Mains", "Desserts"];

// Image mapping object to associate categories with their respective images
const imageMapping: Record<string, any[]> = {
  Starters: [require("../assets/starter1.png"), require("../assets/starter2.png")],
  Mains: [require("../assets/main1.png"), require("../assets/main2.png")],
  Desserts: [require("../assets/dessert1.png"), require("../assets/dessert2.png")],
};

// Color palette constants for consistent theming across management interface
const COLORS = {
  creamLight: 'rgba(250, 245, 235, 0.95)',
  creamMedium: 'rgba(242, 232, 215, 0.9)',
  creamDark: 'rgba(235, 220, 195, 0.85)',
  coffeeLight: 'rgba(165, 137, 107, 0.9)',
  coffeeMedium: 'rgba(139, 108, 77, 0.9)',
  coffeeDark: 'rgba(101, 67, 53, 0.9)',
  caramel: 'rgba(193, 125, 65, 0.9)',
  success: 'rgba(111, 168, 120, 0.9)',
  warning: 'rgba(231, 76, 60, 0.9)',
  white: 'rgba(255, 255, 255, 0.98)',
};

const MenuAddItem: React.FC = () => {
  // Initialize navigation hook for screen transitions
  const navigation = useNavigation<MenuScreenNavigationProp>();
  
  // State for menu data organized by categories
  const [mealsInput, setMealsInput] = useState<MenuData>({ 
    Starters: [], 
    Mains: [], 
    Desserts: [] 
  });
  
  // State for currently selected category
  const [selectedCategory, setSelectedCategory] = useState<keyof MenuData>("Starters");
  
  // State for form input fields
  const [mealName, setMealName] = useState("");
  const [mealDesc, setMealDesc] = useState("");
  const [mealPrice, setMealPrice] = useState("");

  // Effect hook to clear menu storage when component mounts (app start)
  useEffect(() => {
    const clearMenuOnStart = async () => {
      // Remove existing menu data from persistent storage
      await AsyncStorage.removeItem("proposedMenu");
      // Reset local state to empty arrays
      setMealsInput({ Starters: [], Mains: [], Desserts: [] });
    };
    clearMenuOnStart();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect hook to load existing menu data from storage
  useEffect(() => {
    const loadMeals = async () => {
      try {
        // Retrieve menu data from persistent storage
        const saved = await AsyncStorage.getItem("proposedMenu");
        if (saved) {
          // Parse and set menu data if it exists
          setMealsInput(JSON.parse(saved));
        }
      } catch (err) {
        // Error handling for storage retrieval failures
        console.log("Menu loading error:", err);
      }
    };
    loadMeals();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to save menu data to persistent storage
  const saveMeals = async (updatedMeals: MenuData) => {
    // Update local state with new menu data
    setMealsInput(updatedMeals);
    try {
      // Persist updated menu to storage
      await AsyncStorage.setItem("proposedMenu", JSON.stringify(updatedMeals));
    } catch (err) {
      // Error handling for storage save failures
      console.log("Menu saving error:", err);
    }
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

  // Function to handle adding new meals to the menu with validation
  const handleAddMeal = () => {
    // Validate that all required fields are filled
    if (!mealName.trim() || !mealDesc.trim() || !mealPrice.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields to add a meal.");
      return;
    }

    // Get current meals in selected category
    const categoryMeals = mealsInput[selectedCategory];
    
    // Validate category limit (maximum 2 meals per category)
    if (categoryMeals.length >= 2) {
      Alert.alert(
        "Category Full", 
        `Only 2 meals allowed in ${selectedCategory}. Remove one to add another.`
      );
      return;
    }

    // Determine image index based on current meal count in category
    const index = categoryMeals.length;
    // Get appropriate image from mapping, fallback to first image
    const image = imageMapping[selectedCategory][index] || imageMapping[selectedCategory][0];

    // Create new meal object with form data
    const newMeal: Meal = { 
      name: mealName.trim(),     // Trim whitespace from inputs
      desc: mealDesc.trim(), 
      price: mealPrice.trim(), 
      image 
    };
    
    // Create updated menu data with new meal added
    const updatedMeals = {
      ...mealsInput,
      [selectedCategory]: [...categoryMeals, newMeal],
    };
    
    // Save updated menu and show success message
    saveMeals(updatedMeals);
    Alert.alert("Success!", `${mealName} has been added to ${selectedCategory}!`);

    // Clear form inputs after successful addition
    setMealName("");
    setMealDesc("");
    setMealPrice("");
  };

  // Function to remove meals from menu with confirmation dialog
  const removeMeal = (index: number) => {
    Alert.alert(
      "Remove Meal",
      "Are you sure you want to remove this meal from the menu?",
      [
        { text: "Cancel", style: "cancel" }, // Safe cancellation option
        { 
          text: "Remove", 
          style: "destructive", // Visual indication of destructive action
          onPress: () => {
            // Filter out the meal at specified index
            const updatedCategoryMeals = mealsInput[selectedCategory].filter((_, i) => i !== index);
            // Create updated menu data without removed meal
            const updatedMeals = { ...mealsInput, [selectedCategory]: updatedCategoryMeals };
            // Save updated menu data
            saveMeals(updatedMeals);
          }
        }
      ]
    );
  };

  // Helper function to get meal count for specific category
  const getMealCount = (category: keyof MenuData) => {
    return mealsInput[category].length;
  };

  return (
    // Background image container for visual theme consistency
    <ImageBackground
      source={require("../assets/FILTERMENU.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Keyboard avoiding view for better form experience on iOS/Android */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            
            {/* HEADER SECTION with navigation and title */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => navigation.navigate("Menu")}
              >
                <Text style={styles.backBtnText}>← Back to Menu</Text>
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                {/* Enhanced bright text with shadows for better readability */}
                <Text style={styles.title}>Menu Manager</Text>
                <Text style={styles.subtitle}>Create & Organize Your Menu</Text>
              </View>
              
              <View style={styles.headerSpacer} />
            </View>

            {/* CATEGORY SELECTION SECTION */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Select Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryBtn,
                      selectedCategory === cat && [
                        styles.categoryBtnSelected,
                        { backgroundColor: getCategoryColor(cat) } // Dynamic category colors
                      ]
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={styles.categoryIcon}>{getCategoryIcon(cat)}</Text>
                    <Text style={[
                      styles.categoryBtnText,
                      selectedCategory === cat && styles.categoryBtnTextSelected
                    ]}>
                      {cat}
                    </Text>
                    {/* Category count badge showing current/total meals */}
                    <View style={styles.categoryCount}>
                      <Text style={styles.categoryCountText}>
                        {getMealCount(cat)}/2
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ADD MEAL FORM CARD */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formIcon}>➕</Text>
                <Text style={styles.formTitle}>Add New Meal</Text>
              </View>
              
              {/* Meal information input fields */}
              <TextInput
                style={styles.input}
                placeholder="Meal Name"
                placeholderTextColor={COLORS.coffeeMedium}
                value={mealName}
                onChangeText={setMealName}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                placeholderTextColor={COLORS.coffeeMedium}
                value={mealDesc}
                onChangeText={setMealDesc}
                multiline // Allow multiple lines for descriptions
                numberOfLines={3}
              />
              <TextInput
                style={styles.input}
                placeholder="Price (R)"
                placeholderTextColor={COLORS.coffeeMedium}
                keyboardType="numeric" // Optimized keyboard for numbers
                value={mealPrice}
                onChangeText={setMealPrice}
              />

              {/* ACTION BUTTONS ROW */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.addBtn} 
                  onPress={handleAddMeal}
                  disabled={getMealCount(selectedCategory) >= 2} // Disable when category full
                >
                  <Text style={styles.addBtnText}>+ Add to {selectedCategory}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.viewMenuBtn} 
                  onPress={() => navigation.navigate("Menu")}
                >
                  <Text style={styles.viewMenuBtnText}>👀 View Menu</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* MEALS LIST SECTION for current category */}
            <View style={styles.mealsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory} ({getMealCount(selectedCategory)}/2)
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {getMealCount(selectedCategory) === 0 
                    ? "No meals added yet" 
                    : `${getMealCount(selectedCategory)} meal${getMealCount(selectedCategory) !== 1 ? 's' : ''} in this category`
                  }
                </Text>
              </View>

              {/* EMPTY STATE for categories with no meals */}
              {mealsInput[selectedCategory].length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>{getCategoryIcon(selectedCategory)}</Text>
                  <Text style={styles.emptyText}>No {selectedCategory.toLowerCase()} yet</Text>
                  <Text style={styles.emptySubtext}>
                    Add up to 2 delicious {selectedCategory.toLowerCase()} to your menu
                  </Text>
                </View>
              ) : (
                // MEALS LIST with remove functionality
                mealsInput[selectedCategory].map((meal, index) => (
                  <View key={index} style={styles.mealCard}>
                    <Image source={meal.image} style={styles.mealImg} />
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealDesc}>{meal.desc}</Text>
                      <Text style={styles.mealPrice}>R{meal.price}</Text>
                    </View>
                    {/* Remove meal button with confirmation */}
                    <TouchableOpacity 
                      onPress={() => removeMeal(index)} 
                      style={styles.removeBtn}
                    >
                      <Text style={styles.removeBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* BOTTOM SPACER for scroll view padding */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default MenuAddItem;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  keyboardAvoid: {
    flex: 1, // Take full screen height
  },
  scrollContainer: {
    flexGrow: 1, // Allow scroll view to expand with content
    padding: 20,
  },
  mainContainer: {
    width: "100%",
    maxWidth: 500, // Maximum width for larger screens
    alignSelf: "center", // Center container on wide screens
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.creamDark,
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
  headerContent: {
    alignItems: 'center',
    flex: 1, // Take remaining space in header
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white, // Bright white for maximum contrast
    textAlign: "center",
    marginBottom: 4,
    textShadowColor: 'rgba(101, 67, 53, 0.8)', // Dark shadow for readability
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.creamLight, // Bright cream color
    textAlign: "center",
    fontWeight: '700', // Bold for emphasis
    textShadowColor: 'rgba(101, 67, 53, 0.6)', // Subtle shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSpacer: {
    width: 80, // Balance header layout spacing
  },
  categorySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.coffeeDark,
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // Modern gap property for consistent spacing
  },
  categoryBtn: {
    flex: 1, // Equal width for all category buttons
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.creamDark,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8, // Android shadow property
  },
  categoryBtnSelected: {
    borderColor: COLORS.white,
    transform: [{ scale: 1.02 }], // Slight scale for active state
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryBtnText: {
    color: COLORS.coffeeDark,
    fontWeight: "700",
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  categoryBtnTextSelected: {
    color: COLORS.white,
  },
  categoryCount: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryCountText: {
    color: COLORS.coffeeDark,
    fontWeight: "800",
    fontSize: 12,
  },
  formCard: {
    backgroundColor: COLORS.creamMedium,
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.coffeeDark,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.creamDark,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.coffeeDark,
    shadowColor: COLORS.coffeeLight,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top', // Start text from top on Android
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12, // Consistent spacing between buttons
    marginTop: 10,
  },
  addBtn: {
    flex: 1, // Equal width with view menu button
    backgroundColor: COLORS.caramel,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },
  viewMenuBtn: {
    flex: 1, // Equal width with add button
    backgroundColor: COLORS.creamDark,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.coffeeLight,
  },
  viewMenuBtnText: {
    color: COLORS.coffeeDark,
    fontWeight: "700",
    fontSize: 16,
  },
  mealsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.coffeeMedium,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: COLORS.creamMedium,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6, // Reduced opacity for empty state
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.coffeeMedium,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.coffeeLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.creamMedium,
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mealImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  mealInfo: {
    flex: 1, // Take remaining space in card
  },
  mealName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.coffeeDark,
    marginBottom: 4,
  },
  mealDesc: {
    fontSize: 14,
    color: COLORS.coffeeMedium,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.caramel,
  },
  removeBtn: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)', // Semi-transparent red
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  removeBtnText: {
    fontSize: 18,
  },
  bottomSpacer: {
    height: 20, // Additional bottom spacing for scroll view
  },
});