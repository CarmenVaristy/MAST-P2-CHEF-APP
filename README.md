
# React Native Menu Cart App

**Author:** Carmen Jecole
**Date:** 13 November 2025
**Version:** 1.0.0

---

## 1. Project Overview

The **React Native Menu Cart App** is a mobile application designed to simulate a food ordering system. The app allows users to browse a menu, filter items by category (Starters, Mains, Desserts), add items to a cart, view category-specific item counts, and complete a checkout process.

The project demonstrates core React Native skills, including **component-based architecture, state management, navigation, and dynamic UI updates**, and it is suitable for academic assessment or prototype development.

---

## 2. Features

The app contains the following core features:

* Browse menu items and add them to the cart.
* Filter menu items by category in real-time.
* Display live counts of selected items per category.
* Filter cart items by category.
* Reset cart functionality with confirmation.
* Checkout screen summarizing the order.
* Responsive design optimized for mobile screens.

---

## 3. Project Structure

The project is organized as follows:

```
App.tsx                # Entry point with navigation setup
screens/
  HomeScreen.tsx       # Home screen interface
  MenuScreen.tsx       # Menu browsing screen
  FilterMenuScreen.tsx # Menu filtering screen
  CartScreen.tsx       # Cart review screen
  CheckoutScreen.tsx   # Checkout screen
components/
  MenuItem.tsx         # Component for individual menu items
  CartItem.tsx         # Component for individual cart items
styles/                # Shared styling files
assets/                # Images, icons, and media files
```

This structure ensures **modularity and maintainability**, allowing easy updates and scalability.

---

## 4. Screen-by-Screen Description

### 4.1 Home Screen

**Purpose:** Serve as the app’s landing page and guide users into the menu.
**Features:**

* Welcome message and brief instructions.
* Navigation button to the Menu screen.
* Clean, minimalistic interface to ensure smooth onboarding.

### 4.2 Menu Screen

**Purpose:** Allow users to browse available food items and add them to their cart.
**Features:**

* Displays all menu items in a categorized format: Starters, Mains, Desserts.
* Add-to-Cart functionality for each item.
* Live display of selected item counts per category.
* Navigation to Filter Menu and Cart screens.

### 4.3 Filter Menu Screen

**Purpose:** Enable users to filter menu items by category.
**Features:**

* Category filters: Starters, Mains, Desserts, or All.
* Menu updates in real-time based on selected filter.
* Cart selections remain preserved while filtering.

### 4.4 Cart Screen

**Purpose:** Allow users to review, manage, and filter their selected items before checkout.
**Features:**

* Displays all items added to the cart with quantities and category labels.
* Filter options by category.
* Live counts for each category displayed at the top.
* Reset cart button with confirmation alert.

### 4.5 Checkout Screen

**Purpose:** Provide final order confirmation and complete the ordering process.
**Features:**

* Displays a summary of cart items with total quantities.
* Checkout confirmation button.
* Placeholder for future payment integration.

---

## 5. Usage Instructions

1. Open the app to see the Home screen.
2. Navigate to the Menu screen to browse available items.
3. Use the Filter Menu screen to select specific categories.
4. Add desired items to the cart while observing live category counts.
5. Go to the Cart screen to review, filter, or reset selected items.
6. Proceed to the Checkout screen to confirm the order.

---

## 6. Installation Instructions

1. Clone the repository:

   ```bash
   git clone <repo_url>
   ```
2. Navigate to the project folder:

   ```bash
   cd react-native-menu-cart-app
   ```
3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```
4. Start the app using Expo:

   ```bash
   npm start
   ```
5. Open the app on a mobile device using Expo Go or an emulator.

---

## 7. Future Enhancements

* Persist cart data using AsyncStorage or Redux.
* Integrate backend API to fetch real menu items and implement payment functionality.
* Add user authentication for multiple accounts.
* Enhance UI with animations and improved design aesthetics.
* Implement a full checkout process with payment gateway integration.

---

## 8. Credits

* [React Native Documentation](https://reactnative.dev/docs/getting-started)
* [Expo Documentation](https://docs.expo.dev/)
* [React Navigation](https://reactnavigation.org/)

---

## 9. Conclusion

This project demonstrates a fully functional mobile food ordering prototype using **React Native and Expo**. It includes modular code, dynamic UI updates, and a complete ordering flow from menu browsing to checkout. With its structured design, state management, and clear navigation, it is well-suited for assessment and prototype evaluation.

---

________________________________________
Screen shots :

<img width="542" height="977" alt="image" src="https://github.com/user-attachments/assets/5cc7f8a6-5453-49d3-a5bc-390d8bf2d589" />


<img width="538" height="966" alt="image" src="https://github.com/user-attachments/assets/684d09b2-f1fc-464d-bed5-d45a5d3c3f8f" />


<img width="545" height="955" alt="image" src="https://github.com/user-attachments/assets/e20ada94-0c46-47e9-92c8-bec5d53e5daf" />


<img width="537" height="970" alt="image" src="https://github.com/user-attachments/assets/45b6e58a-f165-4f6b-b5bc-ff65ed5e32fc" />


<img width="542" height="956" alt="image" src="https://github.com/user-attachments/assets/b76d30a8-cb68-4831-b11b-a6548a8bd40d" />


REFERENCES:
Sert, M. (2017) 'A shopping cart with React Native', Medium. Available at: https://medium.com/@muratsert1453/a-shopping-cart-with-react-native-33578c4bd1d8
 (Accessed: 28 October 2025).

Kakar, S. (2022) 'Creating a React Native Ecommerce App with Medusa Part 2: Adding Cart and Checkout', Medusa. Available at: https://medusajs.com/blog/react-native-ecommerce-app-part-2/
 (Accessed: 28 October 2025).

'Shopping Cart app using React', GeeksforGeeks. Available at: https://www.geeksforgeeks.org/reactjs/shopping-cart-app-using-react/
 (Accessed: 28 October 2025).

'How to add a Menu in react-native using Material Design?', GeeksforGeeks. Available at: https://www.geeksforgeeks.org/react-native/how-to-add-a-menu-in-react-native-using-material-design/
 (Accessed: 28 October 2025).

'React Native side menu step by step guide with examples', Tricentis. Available at: https://www.tricentis.com/learn/react-native-side-menu-guide
 (Accessed: 28 October 2025).

'Building a React Native Filter - Part 1', Dev.to. Available at: https://dev.to/muvinai/building-a-react-native-filter-part-1-21j7
 (Accessed: 28 October 2025).

'Filter Items in the React Native List View', Egghead.io. Available at: https://egghead.io/lessons/react-filter-items-in-the-react-native-list-view
 (Accessed: 28 October 2025).

'Creating a navigation menu with React Native', Arana Corp. Available at: https://www.aranacorp.com/en/creating-a-navigation-menu-with-react-native/
 (Accessed: 28 October 2025).
