// Checkout.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";

type CheckoutProps = NativeStackScreenProps<RootStackParamList, "Checkout">;

const PROMO_CODES: Record<string, number> = {
  DISCOUNT10: 10,
  DISCOUNT20: 20,
  WELCOME15: 15,
  SAVE25: 25,
};

// COMPLETE Color palette with success color added
const COLORS = {
  creamLight: 'rgba(250, 245, 235, 0.95)',
  creamMedium: 'rgba(242, 232, 215, 0.9)',
  creamDark: 'rgba(235, 220, 195, 0.85)',
  coffeeLight: 'rgba(165, 137, 107, 0.9)',
  coffeeMedium: 'rgba(139, 108, 77, 0.9)',
  coffeeDark: 'rgba(101, 67, 53, 0.9)',
  caramel: 'rgba(193, 125, 65, 0.9)',
  caramelGold: 'rgba(255, 215, 0, 0.8)',
  success: 'rgba(111, 168, 120, 0.9)', // ADDED THIS LINE - green for success states
  white: 'rgba(255, 255, 255, 0.98)',
};

const Checkout: React.FC<CheckoutProps> = ({ route, navigation }) => {
  const { cartItems: initialCart, promoCode: initialPromo = "" } = route.params;

  const [cartItems, setCartItems] = useState(initialCart);
  const [promoCode, setPromoCode] = useState(initialPromo);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  useEffect(() => setCartItems(initialCart), [initialCart]);

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount =
      PROMO_CODES[promoCode.toUpperCase()] !== undefined
        ? (subtotal * PROMO_CODES[promoCode.toUpperCase()]) / 100
        : 0;
    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  const { subtotal, discount, total } = calculateTotals();

  const applyPromoCode = () => {
    if (promoCode && PROMO_CODES[promoCode.toUpperCase()] !== undefined) {
      setAppliedDiscount(PROMO_CODES[promoCode.toUpperCase()]);
      Alert.alert("🎉 Promo Applied!", `You got ${PROMO_CODES[promoCode.toUpperCase()]}% off!`);
    } else if (promoCode) {
      Alert.alert("Invalid Code", "The promo code you entered is not valid.");
    }
  };

  const validateForm = () => {
    if (!name.trim()) return "Please enter your full name";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email address";
    if (!phone.trim() || !/^\d{7,15}$/.test(phone)) return "Please enter a valid phone number";
    if (!address.trim()) return "Please enter your delivery address";
    if (cartItems.length === 0) return "Your cart is empty";
    return null;
  };

  const placeOrder = async () => {
    const error = validateForm();
    if (error) return Alert.alert("Validation Error", error);

    try {
      await AsyncStorage.setItem(
        "lastOrder",
        JSON.stringify({ cartItems, name, email, phone, address, promoCode, total })
      );
      await AsyncStorage.removeItem("cartItems");
    } catch (err) {
      console.log("Error saving order:", err);
    }

    Alert.alert(
      "🎊 Order Confirmed!",
      `Thank you, ${name}!\n\nYour order has been placed successfully.\n\n📍 Delivery to: ${address}\n📞 We'll contact you at: ${phone}\n\n💰 Order Total: R${total.toFixed(2)}`,
      [{ text: "Continue Shopping", onPress: () => navigation.navigate("Home") }]
    );
  };

  return (
    <ImageBackground
      source={require("../assets/check.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backBtnText}>‹ Back to Cart</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Checkout</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>📍</Text>
                <Text style={styles.cardTitle}>Delivery Details</Text>
              </View>
              
              <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                placeholderTextColor={COLORS.coffeeMedium}
                value={name} 
                onChangeText={setName} 
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={COLORS.coffeeMedium}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={COLORS.coffeeMedium}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Delivery Address"
                placeholderTextColor={COLORS.coffeeMedium}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🎁</Text>
                <Text style={styles.cardTitle}>Promo Code</Text>
              </View>
              <View style={styles.promoContainer}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter promo code"
                  placeholderTextColor={COLORS.coffeeMedium}
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
                <TouchableOpacity style={styles.promoBtn} onPress={applyPromoCode}>
                  <Text style={styles.promoBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {appliedDiscount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>🎉 {appliedDiscount}% discount applied!</Text>
                </View>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>📦</Text>
                <Text style={styles.cardTitle}>Order Summary</Text>
              </View>
              <View style={styles.itemsList}>
                {cartItems.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name} × {item.quantity}</Text>
                    <Text style={styles.itemPrice}>R{(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>R{subtotal.toFixed(2)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Discount</Text>
                    {/* FIXED: Now using the properly defined COLORS.success */}
                    <Text style={[styles.totalValue, styles.discountValue]}>-R{discount.toFixed(2)}</Text>
                  </View>
                )}
                <View style={[styles.totalRow, styles.grandTotal]}>
                  <Text style={styles.grandTotalLabel}>Total Amount</Text>
                  <Text style={styles.grandTotalValue}>R{total.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
              <View style={styles.orderBtnContent}>
                <Text style={styles.orderBtnIcon}>✨</Text>
                <View>
                  <Text style={styles.orderBtnText}>Place Your Order</Text>
                  <Text style={styles.orderSubtext}>Total: R{total.toFixed(2)}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.securityContainer}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityText}>
                Your payment information is secure and encrypted
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: "100%", 
    height: "100%" 
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  mainContainer: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.creamMedium,
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
    fontWeight: "600", 
    fontSize: 14 
  },
  title: { 
    fontSize: 36, 
    fontWeight: "800", 
    color: COLORS.creamLight,
    textAlign: "center",
    textShadowColor: COLORS.coffeeDark,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 80,
  },
  card: {
    backgroundColor: COLORS.creamMedium,
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.coffeeDark,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.creamDark,
    borderRadius: 15,
    padding: 18,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.coffeeDark,
    shadowColor: COLORS.coffeeLight,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  promoContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  promoInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.creamDark,
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.coffeeDark,
  },
  promoBtn: {
    backgroundColor: COLORS.caramel,
    paddingHorizontal: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  promoBtnText: {
    color: COLORS.creamLight,
    fontWeight: "700",
    fontSize: 15,
  },
  discountBadge: {
    backgroundColor: COLORS.success, // NOW WORKS - using the defined success color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignSelf: 'center',
  },
  discountText: {
    color: COLORS.creamLight,
    fontWeight: "600",
    fontSize: 14,
  },
  itemsList: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamDark,
  },
  itemName: {
    fontSize: 16,
    color: COLORS.coffeeDark,
    flex: 1,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.caramel,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.creamDark,
    marginVertical: 18,
    borderRadius: 1,
  },
  totalsContainer: {
    gap: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 17,
    color: COLORS.coffeeMedium,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.coffeeDark,
  },
  // FIXED: This style now works because COLORS.success is defined
  discountValue: {
    color: COLORS.success, // Green color for discount amounts
    fontWeight: '700',
  },
  grandTotal: {
    marginTop: 15,
    paddingTop: 18,
    borderTopWidth: 3,
    borderTopColor: COLORS.caramel,
  },
  grandTotalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.coffeeDark,
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.caramel,
  },
  orderBtn: {
    backgroundColor: COLORS.caramel,
    paddingVertical: 22,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: COLORS.coffeeDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  orderBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  orderBtnIcon: {
    fontSize: 20,
  },
  orderBtnText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 20,
    textAlign: "center",
  },
  orderSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: "600",
    fontSize: 15,
    marginTop: 2,
    textAlign: 'center',
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'rgba(250, 245, 235, 0.4)',
    borderRadius: 15,
  },
  securityIcon: {
    fontSize: 16,
  },
  securityText: {
    textAlign: "center",
    color: COLORS.creamLight,
    fontSize: 13,
    fontWeight: "500",
  },
});