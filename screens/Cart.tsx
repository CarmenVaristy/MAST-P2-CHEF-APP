// Cart.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";

// Define TypeScript type for navigation props with strict type checking
type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Cart">;

// Define CartItem interface to structure cart item data throughout the application
export interface CartItem {
  id: string;           // Unique identifier for each cart item
  name: string;         // Display name of the menu item
  price: number;        // Price per unit for calculations
  desc?: string;        // Optional description for additional details
  category: "Starters" | "Mains" | "Desserts"; // Restricted category types
  quantity: number;     // Quantity of this item in cart
  image?: number;       // Optional image reference for visual display
}

// Define categories as tuple for TypeScript literal type preservation
const categories = ["All", "Starters", "Mains", "Desserts"] as const;

// Color palette constants for consistent theming across cart components
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

const Cart: React.FC = () => {
  // Initialize navigation hook for screen transitions
  const navigation = useNavigation<CartScreenNavigationProp>();
  
  // State for cart items array to track user selections
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // State for currently selected category filter
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("All");
  
  // State for loading status to handle async operations
  const [isLoading, setIsLoading] = useState(true);

  // useFocusEffect ensures cart data reloads every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadCart = async () => {
        try {
          // Retrieve cart data from persistent storage
          const storedCart = await AsyncStorage.getItem("cartItems");
          if (storedCart) {
            // Parse stored cart data from JSON string
            const parsedCart = JSON.parse(storedCart);
            // Add default categories to items that don't have them for data consistency
            const cartWithCategories = parsedCart.map((item: any, index: number) => ({
              ...item,
              category: item.category || ["Starters", "Mains", "Desserts"][index % 3]
            }));
            // Update cart state with processed data
            setCartItems(cartWithCategories);
          } else {
            // Set empty cart if no data in storage
            setCartItems([]);
          }
        } catch (err) {
          // Error handling for storage retrieval failures
          console.log("Cart loading error:", err);
          // Fallback to empty cart on error
          setCartItems([]);
        } finally {
          // Always set loading to false when operation completes
          setIsLoading(false);
        }
      };
      
      // Execute cart loading function
      loadCart();
    }, []) // Empty dependency array ensures this runs on every focus
  );

  // Effect hook to automatically save cart whenever items change
  useEffect(() => {
    const saveCart = async () => {
      // Only save if there are items in cart to optimize storage operations
      if (cartItems.length > 0) {
        try {
          // Persist current cart state to storage
          await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
        } catch (err) {
          // Error handling for storage save failures
          console.log("Cart saving error:", err);
        }
      }
    };
    
    // Execute cart saving function
    saveCart();
  }, [cartItems]); // Dependency on cartItems ensures save on every change

  // Function to clear entire cart with user confirmation
  const clearCart = async () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      [
        { text: "Cancel", style: "cancel" }, // Safe cancellation option
        { 
          text: "Clear Cart", 
          style: "destructive", // Visual indication of destructive action
          onPress: async () => {
            // Clear cart state
            setCartItems([]);
            // Remove cart data from persistent storage
            await AsyncStorage.removeItem("cartItems");
          }
        }
      ]
    );
  };

  // Function to increase quantity of specific cart item
  const increaseQuantity = (id: string) => {
    setCartItems(prevItems => 
      // Map through items and increment quantity for matching ID
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to decrease quantity of specific cart item
  const decreaseQuantity = (id: string) => {
    setCartItems(prevItems => 
      // Map through items, decrement quantity for matching ID, and filter out zero quantities
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0) // Remove items when quantity reaches zero
    );
  };

  // Function to remove specific item from cart with confirmation
  const removeFromCart = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => setCartItems(prevItems => prevItems.filter(item => item.id !== id))
        }
      ]
    );
  };

  // Filter cart items based on selected category
  const filteredCartItems =
    selectedCategory === "All"
      ? cartItems // Show all items when "All" is selected
      : cartItems.filter((item) => item.category === selectedCategory); // Filter by category

  // Function to calculate item count for each category
  const getCategoryCount = (cat: typeof categories[number]) => {
    if (cat === "All") {
      // Calculate total quantity across all items for "All" category
      return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // Calculate total quantity for specific category
    return cartItems
      .filter((item) => item.category === cat)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Function to calculate total number of items in cart
  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Function to calculate total price of all items in cart
  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Function to calculate average price per item
  const getAveragePrice = () => {
    const totalItems = getTotalItems();
    // Return average or zero to prevent division by zero
    return totalItems > 0 ? getTotalPrice() / totalItems : 0;
  };

  // Function to navigate to checkout screen with validation
  const goCheckout = () => {
    if (!cartItems.length) {
      // Prevent checkout with empty cart
      Alert.alert("Cart Empty", "Your cart is empty. Add some delicious items first!");
      return;
    }
    // Navigate to checkout with current cart items
    navigation.navigate("Checkout", { cartItems });
  };

  // Loading state display
  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your cart... ☕</Text>
      </View>
    );

  return (
    // Background image container for visual theme consistency
    <ImageBackground source={require("../assets/YOURCART.png")} style={styles.bg}>
      <View style={styles.container}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
          <Text style={styles.subtitle}>Delicious choices await! 🛒</Text>
          {/* Conditional clear cart button - only show when items exist */}
          {cartItems.length > 0 && (
            <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SUMMARY CARD with cart statistics */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>Cart Summary</Text>
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>{getTotalItems()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R{getTotalPrice().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Average Price</Text>
              <Text style={styles.summaryValue}>R{getAveragePrice().toFixed(2)}</Text>
            </View>
            {/* Category breakdown with visual badges */}
            <View style={styles.categorySummary}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>🥗 {getCategoryCount("Starters")}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>🍝 {getCategoryCount("Mains")}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>🍰 {getCategoryCount("Desserts")}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CATEGORY FILTERS for cart items */}
        <View style={styles.filterContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catBtn, 
                selectedCategory === cat && styles.catBtnActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.catBtnText,
                selectedCategory === cat && styles.catBtnTextActive
              ]}>
                {cat === "All" ? "🛒 All" : cat === "Starters" ? "🥗 Starters" : cat === "Mains" ? "🍝 Mains" : "🍰 Desserts"} ({getCategoryCount(cat)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CART ITEMS LIST with scroll capability */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredCartItems.length === 0 ? (
            // EMPTY STATE display for no items
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>
                {cartItems.length === 0 ? "🛒" : "🔍"}
              </Text>
              <Text style={styles.emptyText}>
                {cartItems.length === 0 ? "Your cart is empty" : "No items in this category"}
              </Text>
              <Text style={styles.emptySubtext}>
                {cartItems.length === 0 ? "Add some delicious items from the menu!" : "Try selecting a different category"}
              </Text>
              {/* Conditional menu navigation button for empty cart */}
              {cartItems.length === 0 && (
                <TouchableOpacity 
                  style={styles.menuBtn}
                  onPress={() => navigation.navigate("Menu")}
                >
                  <Text style={styles.menuBtnText}>Browse Menu 🍽️</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // CART ITEMS display with quantity controls
            filteredCartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {/* Conditional description display */}
                  {item.desc && <Text style={styles.itemDesc}>{item.desc}</Text>}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                    <Text style={styles.itemCategory}>
                      {item.category === "Starters" ? "🥗" : item.category === "Mains" ? "🍝" : "🍰"} {item.category}
                    </Text>
                  </View>
                </View>

                {/* ACTION CONTROLS for quantity management */}
                <View style={styles.actionsContainer}>
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => decreaseQuantity(item.id)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyCounter}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => increaseQuantity(item.id)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Remove item button */}
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* FOOTER SECTION with totals and action buttons */}
        {filteredCartItems.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>
                {selectedCategory === "All" ? "Cart Total" : `${selectedCategory} Total`}
              </Text>
              <Text style={styles.totalAmount}>
                R{filteredCartItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              {/* Secondary action - continue shopping */}
              <TouchableOpacity 
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate("Menu")}
              >
                <Text style={styles.secondaryBtnText}>← Continue Shopping</Text>
              </TouchableOpacity>
              
              {/* Primary action - proceed to checkout */}
              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={goCheckout}
              >
                <Text style={styles.primaryBtnText}>Proceed to Checkout →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default Cart;

const styles = StyleSheet.create({
  bg: { 
    flex: 1, 
    resizeMode: "cover" 
  },
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "rgba(101, 67, 53, 0.4)" // Semi-transparent overlay
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.creamLight,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.coffeeDark,
    fontWeight: '600',
  },
  header: {
    backgroundColor: COLORS.creamMedium,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: { 
    fontSize: 32, 
    fontWeight: "800", 
    color: COLORS.coffeeDark,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.coffeeMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
  clearBtn: {
    position: 'absolute', // Position independently in header
    top: 20,
    right: 20,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  clearBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: COLORS.creamMedium,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.coffeeDark,
  },
  summaryContent: {
    gap: 12, // Modern gap for consistent spacing
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.coffeeMedium,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.coffeeDark,
  },
  categorySummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  categoryBadge: {
    backgroundColor: COLORS.caramel,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  categoryText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10, // Consistent gap between filter buttons
  },
  catBtn: { 
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
  catBtnActive: { 
    backgroundColor: COLORS.caramel,
    borderColor: COLORS.coffeeLight,
  },
  catBtnText: { 
    color: COLORS.coffeeDark, 
    fontWeight: "600",
    fontSize: 14,
  },
  catBtnTextActive: { 
    color: COLORS.white,
    fontWeight: "700",
  },
  scrollContent: { 
    paddingBottom: 20,
    flexGrow: 1, // Allows scroll view to expand with content
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.creamLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: COLORS.creamLight,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 25,
  },
  menuBtn: {
    backgroundColor: COLORS.caramel,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  menuBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.creamMedium,
    borderRadius: 18,
    padding: 18,
    marginVertical: 8,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  itemInfo: {
    flex: 1, // Take remaining space in row
  },
  itemName: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: COLORS.coffeeDark,
    marginBottom: 4,
  },
  itemDesc: { 
    fontSize: 14, 
    color: COLORS.coffeeMedium,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.caramel,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.coffeeLight,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Consistent gap between action elements
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 6,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.coffeeDark,
  },
  qtyCounter: { 
    marginHorizontal: 12, 
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.coffeeDark,
    minWidth: 20, // Ensure consistent width for numbers
    textAlign: 'center',
  },
  removeBtn: {
    padding: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.1)', // Semi-transparent red
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  removeBtnText: {
    fontSize: 16,
  },
  footer: {
    backgroundColor: COLORS.creamMedium,
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: -5 }, // Shadow above for lifted effect
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.creamDark,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.coffeeDark,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.caramel,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12, // Consistent gap between action buttons
  },
  secondaryBtn: {
    flex: 1, // Equal width with primary button
    backgroundColor: COLORS.creamDark,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.coffeeLight,
  },
  secondaryBtnText: {
    color: COLORS.coffeeDark,
    fontWeight: '700',
    fontSize: 16,
  },
  primaryBtn: {
    flex: 1, // Equal width with secondary button
    backgroundColor: COLORS.caramel,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 16,
  },
});