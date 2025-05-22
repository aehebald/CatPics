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

1. Start the development server:
```bash
npm start
```

2. Use the Expo Go app on your mobile device to scan the QR code, or press:
- `a` to run on Android emulator
- `i` to run on iOS simulator
- `w` to run in web browser

## Environment Variables

The app requires the following environment variables:
- `CAT_API_KEY`: Your API key from The Cat API (https://thecatapi.com/)

## Technologies Used

- React Native
- Expo
- Axios for API calls
- The Cat API