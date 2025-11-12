import { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ====== MEAL IMAGES ======
import starter1 from './assets/starter1.png';
import starter2 from './assets/starter2.png';
import main1 from './assets/main1.png';
import main2 from './assets/main2.png';
import dessert1 from './assets/dessert1.png';
import dessert2 from './assets/dessert2.png';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'menu', 'cartPage', 'filterPage', 'checkoutPage'
  const [cartItems, setCartItems] = useState([]);
  const [proposedMenu, setProposedMenu] = useState({ Starters: [], Mains: [], Desserts: [] });

  // Checkout page states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');

  let filterTitleTop = 60;

  const addToCart = (meal) => setCartItems([...cartItems, meal]);
  const removeFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  // ====== FUNCTION TO GET MEAL IMAGE ======
  const getMealImage = (category, index) => {
    const images = {
      Starters: [starter1, starter2],
      Mains: [main1, main2],
      Desserts: [dessert1, dessert2],
    };
    return images[category][index % images[category].length];
  };

  // ================= FILTER BLOCK COMPONENT =================
  const FilterBlock = () => {
    const [selectedCategory, setSelectedCategory] = useState('Starters');
    const [mealsInput, setMealsInput] = useState({ Starters: [], Mains: [], Desserts: [] });
    const [mealName, setMealName] = useState('');
    const [mealDesc, setMealDesc] = useState('');
    const [mealPrice, setMealPrice] = useState('');

    const addMeal = () => {
      if (mealName && mealDesc && mealPrice) {
        setMealsInput(prev => ({
          ...prev,
          [selectedCategory]: [
            ...prev[selectedCategory],
            { name: mealName, desc: mealDesc, price: mealPrice }
          ]
        }));
        setMealName('');
        setMealDesc('');
        setMealPrice('');
      }
    };

    const removeMeal = (index) => {
      setMealsInput(prev => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory].filter((_, i) => i !== index)
      }));
    };

    const handleAddToMenu = () => {
      setProposedMenu(mealsInput);
      setCurrentPage('menu');
    };

    return (
      <View style={styles.filterBlock}>
        {/* Category Selector */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
          {['Starters', 'Mains', 'Desserts'].map(cat => (
            <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)}>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: selectedCategory === cat ? 'black' : 'gray'
              }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal Input Fields */}
        <TextInput
          placeholder="Meal Name"
          value={mealName}
          onChangeText={setMealName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={mealDesc}
          onChangeText={setMealDesc}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={mealPrice}
          onChangeText={setMealPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Add Meal Button */}
        <TouchableOpacity onPress={addMeal} style={{ marginBottom: 12 }}>
          <Text style={{ color: 'green', fontWeight: '600' }}>+ Add Meal</Text>
        </TouchableOpacity>

        {/* Meal List */}
        <ScrollView style={{ maxHeight: 150, marginBottom: 12 }}>
          {mealsInput[selectedCategory].map((meal, index) => (
            <View key={index} style={[styles.mealRow, { paddingVertical: 4 }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>{meal.name} - R{meal.price}</Text>
                <Text style={{ color: 'gray' }}>{meal.desc}</Text>
              </View>
              <TouchableOpacity onPress={() => removeMeal(index)}>
                <Ionicons name="trash-bin" size={20} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Add to Menu Button */}
        <TouchableOpacity onPress={handleAddToMenu} style={styles.addMenuButton}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Add to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  };


  // ================= MENU PAGE =================
if (currentPage === 'menu') {
  // Calculate average price per course
  const getAveragePrice = (category) => {
    const items = proposedMenu[category];
    if (!items || items.length === 0) return 0;
    const total = items.reduce((sum, meal) => sum + Number(meal.price), 0);
    return (total / items.length).toFixed(2);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 40,
          paddingBottom: 20,
          alignItems: 'center',
          backgroundColor: '#fff',
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#333' }}>
          Christoffel Shop
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            color: '#555',
            marginTop: 4,
          }}
        >
          THE CHRISTOFFEL MENU
        </Text>
      </View>

      {/* Menu Columns */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {['Starters', 'Mains', 'Desserts'].map((cat, colIndex) => (
            <View key={cat} style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.columnTitle}>{cat}</Text>

              {/* Average Price Display */}
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#444',
                }}
              >
                Avg: R{getAveragePrice(cat)}
              </Text>

              {proposedMenu[cat] && proposedMenu[cat].length > 0 ? (
                proposedMenu[cat].map((meal, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mealCard,
                      {
                        backgroundColor:
                          colIndex === 0
                            ? '#ffd6d6'
                            : colIndex === 1
                            ? '#d6f0ff'
                            : '#fff0d6',
                        borderRadius: 12,
                        padding: 10,
                        marginBottom: 14,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 3,
                      },
                    ]}
                  >
                    <Image
                      source={getMealImage(cat, i)}
                      style={[styles.mealImage, { borderRadius: 8 }]}
                    />
                    <Text
                      style={[styles.mealName, { fontWeight: '600', marginVertical: 4 }]}
                    >
                      {meal.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                      {meal.desc}
                    </Text>
                    <Text style={[styles.mealPrice, { fontWeight: '500', marginBottom: 8 }]}>
                      R{meal.price}
                    </Text>
                    <TouchableOpacity
                      style={{
                        ...styles.addBtn,
                        backgroundColor: '#556b2f',
                        paddingVertical: 8,
                        borderRadius: 8,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                      }}
                      onPress={() => addToCart(meal)}
                    >
                      <Text style={{ color: '#fff', fontWeight: '600' }}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>
                  No items
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: 40, left: 20 }]}
        onPress={() => setCurrentPage('filterPage')}
      >
        <Text style={styles.buttonText}>⬅ Back</Text>
      </TouchableOpacity>

      {/* Cart Button */}
      <View style={[styles.topRightButtons, { top: 40 }]}>
        <TouchableOpacity
          style={{
            ...styles.topButton,
            backgroundColor: '#556b2f',
            paddingHorizontal: 10,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setCurrentPage('cartPage')}
        >
          <Ionicons name="cart" size={24} color="#fff" />
          <Text style={[styles.cartCount, { fontWeight: '700', marginLeft: 4 }]}>
            ({cartItems.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


  // ================= FILTER PAGE =================
  if(currentPage === 'filterPage'){
    return (
      <View style={{ flex:1 }}>
        <Image source={require('./assets/FILTERMENU.png')} style={styles.fullScreenImage} resizeMode="cover"/>
        <View style={[styles.filterTitle, { top: filterTitleTop }]}>
          <Text style={{ color:'#fff', fontSize:20, fontWeight:'700' }}>Filter Menu</Text>
        </View>
        <FilterBlock/>
        <TouchableOpacity style={[styles.backButton,{top:20}]} onPress={()=>setCurrentPage('home')}>
          <Text style={styles.buttonText}>⬅ Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ================= CART PAGE =================
  if (currentPage === 'cartPage') {
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  return (
    <View style={{ flex: 1 }}>
      {/* Background Image */}
      <Image
        source={require('./assets/YOURCART.png')}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.35)', // subtle overlay for readability
        }}
      />

      {/* Page Title */}
      <View style={[styles.filterTitle, { top: filterTitleTop }]}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
          Your Cart
        </Text>
      </View>

      {/* Cart Items List */}
      <ScrollView style={styles.cartList} contentContainerStyle={{ padding: 20 }}>
        {cartItems.length > 0 ? (
          cartItems.map((meal, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                marginBottom: 12,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
                {meal.name} x {meal.quantity || 1} – R
                {(Number(meal.price) * (meal.quantity || 1)).toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => removeFromCart(index)}>
                <Ionicons name="trash-bin" size={22} color="#c0392b" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, marginTop: 20 }}>
            No items in cart
          </Text>
        )}

        {/* Total */}
        {cartItems.length > 0 && (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 12,
              alignSelf: 'flex-end',
              color: '#fff',
              textShadowColor: 'rgba(0,0,0,0.6)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            Total: R{total.toFixed(2)}
          </Text>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            backgroundColor: '#556b2f',
            paddingVertical: 14,
            paddingHorizontal: 40,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => setCurrentPage('checkoutPage')}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>
            Checkout
          </Text>
        </TouchableOpacity>
      )}

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: 20 }]}
        onPress={() => setCurrentPage('menu')}
      >
        <Text style={styles.buttonText}>⬅ Back</Text>
      </TouchableOpacity>
    </View>
  );
}


  // ================= CHECKOUT PAGE =================
 if (currentPage === 'checkoutPage') {
  const subtotal = cartItems.reduce((sum, m) => sum + Number(m.price), 0);
  const discount = promoCode === '10%' ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.15;
  const total = subtotal - discount + tax;

  const handleConfirm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPromoCode('');
    setPaymentMethod('Card');
    setCartItems([]);
    setCurrentPage('home');
  };

  const inputWidth = '25%';

  return (
    <View style={{ flex: 1 }}>
      {/* Background Image */}
      <Image
        source={require('./assets/check.png')}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.5)', // slightly darker overlay for readability
        }}
      />

      {/* Page Title */}
      <View style={[styles.filterTitle, { top: filterTitleTop }]}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>
          Checkout
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          marginTop: 120,
          alignItems: 'center',
          paddingBottom: 220,
        }}
      >
        {/* Input Fields */}
        {[
          { label: 'Name', value: name, setter: setName, placeholder: 'Your Name', keyboardType: 'default' },
          { label: 'Email', value: email, setter: setEmail, placeholder: 'Your Email', keyboardType: 'email-address' },
          { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Phone Number', keyboardType: 'phone-pad' },
          { label: 'Address', value: address, setter: setAddress, placeholder: 'Delivery Address', keyboardType: 'default' },
        ].map((field, idx) => (
          <View key={idx} style={{ width: inputWidth, marginBottom: 18 }}>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 6, letterSpacing: 0.5 }}>
              {field.label}
            </Text>
            <TextInput
              value={field.value}
              onChangeText={field.setter}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType}
              style={[
                styles.input,
                {
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 10,
                  fontSize: 14,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                },
              ]}
            />
          </View>
        ))}

        {/* Payment Method */}
        <View style={{ width: inputWidth, marginBottom: 18 }}>
          <Text style={{ color: '#fff', fontSize: 16, marginBottom: 6, letterSpacing: 0.5 }}>
            Payment Method
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {['Card', 'PayPal', 'Mobile Money'].map(pm => (
              <TouchableOpacity
                key={pm}
                onPress={() => setPaymentMethod(pm)}
                style={{
                  flex: 1,
                  backgroundColor: paymentMethod === pm ? '#556b2f' : '#888',
                  paddingVertical: 12,
                  marginRight: pm !== 'Mobile Money' ? 10 : 0,
                  borderRadius: 10,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 4,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>{pm}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Code */}
        <View style={{ width: inputWidth, marginBottom: 18 }}>
          <Text style={{ color: '#fff', fontSize: 16, marginBottom: 6, letterSpacing: 0.5 }}>
            Promo Code
          </Text>
          <TextInput
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Enter promo code e.g. 10%"
            style={[
              styles.input,
              {
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                fontSize: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              },
            ]}
          />
        </View>

        {/* Summary Box */}
        <View
          style={{
            marginTop: 24,
            padding: 20,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 14,
            width: inputWidth,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Subtotal: R{subtotal.toFixed(2)}</Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Discount: R{discount.toFixed(2)}</Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Tax: R{tax.toFixed(2)}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 6 }}>Total: R{total.toFixed(2)}</Text>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={{ position: 'absolute', bottom: 40, right: 100}}>
        <TouchableOpacity
          onPress={handleConfirm}
          style={{
            backgroundColor: '#556b2f',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 12,
            minWidth: 110,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Confirm</Text>
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: 20 }]}
        onPress={() => setCurrentPage('cartPage')}
      >
        <Text style={styles.buttonText}>⬅ Back</Text>
      </TouchableOpacity>
    </View>
  );
}

  // ================= HOME PAGE =================
  return (
    <View style={styles.container}>
      <Image source={require('./assets/HOMEPAGE.png')} style={styles.image} resizeMode="cover"/>
      <View style={styles.navbar}></View>
      <View style={styles.topRightButtons}>
        <TouchableOpacity style={styles.topButton} onPress={()=>setCurrentPage('cartPage')}>
          <Ionicons name="cart" size={24} color="#fff"/>
          <Text style={styles.cartCount}>({cartItems.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topButton} onPress={()=>setCurrentPage('filterPage')}>
          <Text style={styles.navText}>Create/Filter Menu</Text>
        </TouchableOpacity>
     
      </View>

      <View style={styles.shopNameContainer}>
        <Text style={styles.shopName}>Christoffel</Text>
        <Text style={styles.menuText}>MENU</Text>
        <Text style={styles.tagline}>Delicious treats, anytime, anywhere</Text>
        <Text style={styles.special}>This Week's Special - 20% Off All Mains</Text>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: '100%', position: 'absolute', zIndex: 0 },
  fullScreenImage: { width: '100%', height: '100%', position: 'absolute', zIndex: 0 },

  navbar: { flexDirection: 'row', marginTop: 40, marginLeft: 20, alignItems: 'center', zIndex: 2 },
  navText: { fontSize: 18, fontWeight: '600', color: '#fff' },
  separator: { fontSize: 18, color: '#fff', marginHorizontal: 8 },

  shopNameContainer: { position: 'absolute', top: 80, width: '100%', alignItems: 'center', flexDirection: 'column', zIndex: 2 },
  shopName: { 
    fontSize: 70, color: '#fff', fontWeight: '300', fontFamily: 'Snell Roundhand, Brush Script MT, cursive', 
    textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 
  },
  menuText: { fontSize: 100, fontWeight: '700', fontFamily: 'Times New Roman', marginTop: 4, textAlign: 'center', color: '#FF6347' },
  tagline: { fontSize: 20, color: '#D2B48C', textAlign: 'center', marginTop: 20, fontFamily: 'Times New Roman', fontStyle: 'italic' },
  special: { fontSize: 20, color: '#FFD700', fontWeight: '700', fontStyle: 'italic', textAlign: 'center', marginTop: 8, fontFamily: 'Times New Roman' },

  input: { borderBottomWidth: 1, marginBottom: 8, padding: 6, backgroundColor: '#fff', borderRadius: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },

  backButton: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, zIndex: 3 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  topRightButtons: { position: 'absolute', top: 40, right: 20, flexDirection: 'row', zIndex: 5 },
  topButton: { backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginLeft: 10 },
  cartCount: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '700' },

  filterBlock: { position: 'absolute', top: 120, width: '50%', height: '40%', alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: 15, zIndex: 2, shadowColor: "#000", shadowOffset: { width:0, height:2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  addMenuButton: { alignSelf: 'flex-end', backgroundColor: '#444', padding: 10, borderRadius: 8, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },

  filterTitle: { position: 'absolute', width: '50%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 10, zIndex: 3, alignItems: 'center' },
  cartList: { position: 'absolute', top: 120, width: '50%', alignSelf: 'center', maxHeight: '60%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 15, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },

  menuGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, marginHorizontal: 5 },
  columnTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },

  mealCard: { borderRadius: 12, padding: 10, marginBottom: 14, alignItems: 'center', backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  mealImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 6 },
  mealName: { fontSize: 16, fontWeight: '600' },
  mealPrice: { fontSize: 14, color: '#333', marginBottom: 6 },
  addBtn: { backgroundColor: '#556b2f', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },

  checkoutButton: { backgroundColor: '#556b2f', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, position: 'absolute', alignSelf: 'center', shadowColor: '#000', shadowOffset: { width:0, height:3 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }
});
