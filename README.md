# Cat Pictures App

A React Native application that displays random cat pictures using The Cat API.

## Features

- Displays random cat pictures in a scrollable list
- Infinite scrolling to load more images
- Modern UI with smooth animations
- Loading indicators

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- JDK 11 or newer

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Cat API key:
   ```
   CAT_API_KEY=your_api_key_here
   ```

## Running the App

### Using Expo Go (Easiest Method)
1. Start the development server:
```bash
npm start
```

2. Use the Expo Go app on your mobile device to scan the QR code, or press:
- `a` to run on Android emulator
- `i` to run on iOS simulator
- `w` to run in web browser

### Using Android Studio
1. Generate native Android files:
```bash
npx expo prebuild
```

2. Open Android Studio:
   - Select "Open an existing project"
   - Navigate to the `android` folder in your project
   - Wait for Gradle sync to complete
   - Click the "Run" button (green play icon)

Or run directly from command line:
```bash
npm run build:android
```

## Environment Variables

The app requires the following environment variables:
- `CAT_API_KEY`: Your API key from The Cat API (https://thecatapi.com/)

## Technologies Used

- React Native
- Expo
- Axios for API calls
- The Cat API