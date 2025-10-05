# API Integration Training - Mobile App

React Native/Expo mobile app for learning API integration patterns on the go.

## 📱 Testing on Your Phone (Easiest!)

### 1. Install Expo Go App
Download from App Store (iOS) or Play Store (Android):
- **iOS**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

### 2. Start the Development Server
```bash
cd mobile
npm start
```

### 3. Scan QR Code
- **iOS**: Open Camera app and scan the QR code in your terminal
- **Android**: Open Expo Go app and scan the QR code

That's it! The app will load on your phone instantly. Any code changes will auto-reload.

---

## 🖥️ Testing on Emulator/Simulator

### iOS Simulator (Mac Only)

#### 1. Install Xcode
Download from Mac App Store (large download, ~10GB)

#### 2. Install Command Line Tools
```bash
xcode-select --install
```

#### 3. Run on iOS
```bash
cd mobile
npm run ios
```

This will:
- Start the development server
- Launch iOS Simulator
- Install and run the app

---

### Android Emulator

#### 1. Install Android Studio
Download from: https://developer.android.com/studio

#### 2. Set up Android Emulator
In Android Studio:
- Tools → Device Manager
- Create Virtual Device
- Choose a device (e.g., Pixel 6)
- Download a system image (e.g., Android 13)
- Finish setup

#### 3. Start the Emulator
Open Android Studio → Device Manager → Click play button on your device

#### 4. Run on Android
```bash
cd mobile
npm run android
```

---

## 🚀 Features

### Currently Implemented:
- ✅ Home screen with all 4 phases
- ✅ Phase 1 overview with Pareto Principle summary
- ✅ Interactive REST API demo with live testing
  - GET /users (fetch all users)
  - GET /users/:id (fetch specific user)
  - POST /users (create new user)
- ✅ Real API calls to JSONPlaceholder
- ✅ Response time tracking
- ✅ Error handling

### Coming Soon:
- GraphQL, gRPC, WebSocket, Event-Driven demos
- Phases 2-4 content
- Offline mode with cached responses
- Documentation modals

---

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser (for testing)
npm run web

# Clear cache if issues
npm start -- --clear
```

---

## 📱 Quick Testing Tips

### On Physical Phone (Recommended for Best Experience):
1. Connect to same WiFi as your computer
2. Scan QR code with Expo Go
3. Shake phone to open dev menu
4. Enable "Fast Refresh" for auto-reload

### On Emulator:
- **iOS Simulator**: Press `Cmd + D` for dev menu
- **Android Emulator**: Press `Cmd/Ctrl + M` for dev menu

---

## 🎨 Project Structure

```
mobile/
├── src/
│   ├── screens/          # All screen components
│   │   ├── HomeScreen.tsx
│   │   ├── Phase1Screen.tsx
│   │   ├── Phase1InteractiveScreen.tsx
│   │   └── PlaceholderScreen.tsx
│   ├── components/       # Reusable components (future)
│   ├── navigation/       # Navigation setup
│   │   └── RootNavigator.tsx
│   └── types/           # TypeScript types
│       └── navigation.ts
├── App.tsx              # Main app entry point
└── package.json         # Dependencies
```

---

## 🔧 Troubleshooting

### "Expo Go" app not connecting
- Ensure phone and computer are on same WiFi
- Try using tunnel mode: `npm start -- --tunnel`

### "Metro bundler" issues
- Clear cache: `npm start -- --clear`
- Delete `node_modules`: `rm -rf node_modules && npm install`

### Simulator not launching
- **iOS**: Make sure Xcode is fully installed
- **Android**: Make sure Android Studio emulator is running

---

## 📚 Resources

- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- React Native: https://reactnative.dev

