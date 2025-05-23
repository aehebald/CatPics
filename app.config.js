export default {
  name: "CatPics",
  slug: "catpics",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  assetBundlePatterns: [
    "**/*"
  ],
  splash: {
    backgroundColor: "#ffffff"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.bobdunder.catpics",
    versionCode: 1,
    minSdkVersion: 21,
    targetSdkVersion: 35,
    permissions: [
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE",
      "READ_MEDIA_IMAGES",
      "READ_MEDIA_VIDEO"
    ],
    softwareKeyboardLayoutMode: "pan"
  },
  extra: {
    catApiKey: process.env.CAT_API_KEY || 'live_tbwqYYhmHUT6XdbwWvJuMU7mqygie9JO2eGhiChXzkMwrEaWwJ2YECeUFYemBO2u',
    eas: {
      projectId: "ff68e745-7d71-4baf-af59-481b44d11d17"
    }
  }
}; 