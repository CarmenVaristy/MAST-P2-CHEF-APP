project:
  name: React Native Menu Cart App
  
  description: >
    A React Native mobile application designed for food ordering. Users can
    browse a menu, filter items by category, add items to a cart, and
    proceed to checkout. The app showcases dynamic category counts, responsive
    UI, and smooth navigation between screens.
	
  author: Carmen Jecole
  date_created: 2025-11-13
  
  version: 1.0.0
  tech_stack:
    - React Native
    - Expo
    - React Navigation
    - JavaScript / TypeScript
    - State management via useState & useEffect
    - Optional: Vector Icons (Ionicons)

project_overview: >
  This project simulates a food ordering system with an intuitive mobile interface.
  Users can browse menu items, filter by categories (Starters, Mains, Desserts),
  view live item counts per category, add items to a cart, and complete a checkout
  process. Each screen has been designed for clarity, usability, and responsiveness.

screens:
  - name: HomeScreen
    description: >
      The first screen users see upon opening the app. It provides:
        - Welcome message and brief instructions.
        - Navigation buttons to the Menu screen.
        - Clean and simple UI to set the tone for the app.
      Purpose: To guide users smoothly into the menu browsing process.

  - name: MenuScreen
    description: >
      Displays all available menu items. Key features:
        - Categorized items (Starters, Mains, Desserts).
        - Add to Cart buttons for each item.
        - Dynamic display of selected item counts per category.
        - Navigation to Filter Menu and Cart screens.
      Purpose: Allow users to browse the menu and add items to the cart.

  - name: FilterMenuScreen
    description: >
      Provides filtering options for menu items. Key features:
        - Users can filter items by category: Starters, Mains, Desserts, or All.
        - Real-time update of menu display based on selected filter.
        - Maintains cart selections while filtering.
      Purpose: Enable users to easily find specific types of menu items.

  - name: CartScreen
    description: >
      Displays all items currently added to the cart. Key features:
        - Item list with quantity and category labels.
        - Category filters to show only Starters, Mains, Desserts, or All.
        - Dynamic live counts for each category.
        - Reset cart button with confirmation alert.
      Purpose: Allow users to review, filter, and manage their selected items before checkout.

  - name: CheckoutScreen
    description: >
      Final step of the ordering process. Key features:
        - Displays summary of cart items with total quantities.
        - Provides a checkout confirmation button.
        - Optionally, a placeholder for future payment integration.
      Purpose: Complete the ordering flow and confirm user selections.

features:
  - Browse menu items and add to cart.
  - Filter menu by category in real-time.
  - Dynamic live counts of selected items per category.
  - Filter cart items by category.
  - Reset cart functionality with confirmation.
  - Checkout screen summarizing order.
  - Responsive design for mobile screens.

project_structure:
  - App.tsx: Entry point with navigation setup.
  - screens/
      - HomeScreen.tsx
      - MenuScreen.tsx
      - FilterMenuScreen.tsx
      - CartScreen.tsx
      - CheckoutScreen.tsx
  - components/
      - MenuItem.tsx: Displays individual menu items.
      - CartItem.tsx: Displays individual cart items.
  - styles/: Shared styling files.
  - assets/: Images, icons, and other media.

installation:
  steps:
    - "Clone the repository: git clone <repo_url>"
    - "Navigate into project folder: cd react-native-menu-cart-app"
    - "Install dependencies: npm install or yarn install"
    - "Start Expo: npm start or expo start"
    - "Open on device using Expo Go app or an emulator"

usage:
  - "Open the app to see the Home screen."
  - "Navigate to the Menu screen to browse items."
  - "Use Filter Menu to view specific categories."
  - "Add items to cart; observe live category counts."
  - "Go to Cart screen to review selections."
  - "Reset cart if needed, or proceed to Checkout screen."
  - "Confirm order on Checkout screen."

future_enhancements:
  - Persist cart using AsyncStorage or Redux.
  - Integrate backend API for real menu items and payment.
  - Add user authentication for multiple accounts.
  - Enhance UI with animations and improved design.
  - Implement full checkout with payment gateway.

credits:
  - React Native Documentation: https://reactnative.dev/docs/getting-started
  - Expo Documentation: https://docs.expo.dev/
  - React Navigation: https://reactnavigation.org/

license: MIT

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
