import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, ActivityIndicator, SafeAreaView, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import FavoritesScreen from './screens/FavoritesScreen';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';

const Stack = createNativeStackNavigator();
const API_KEY = Constants.expoConfig.extra.catApiKey;
const API_URL = 'https://api.thecatapi.com/v1/images/search';

function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const { favorites, images, toggleFavorite, addImages } = useFavorites();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}?limit=10`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      addImages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl) => {
    try {
      const filename = imageUrl.split('/').pop();
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResult.status === 200) {
        Alert.alert('Success', 'Image downloaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to download image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert('Error', 'Failed to download image');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={favorites.has(item.id) ? '#ff4444' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => downloadImage(item.url)}
        >
          <Ionicons name="download-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const loadMore = () => {
    if (!loading) {
      setLoading(true);
      fetchImages();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        )}
      />
    </SafeAreaView>
  );
}

function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Cat Pictures',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Favorites')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="heart" size={24} color="#ff4444" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  iconButton: {
    padding: 5,
  },
}); 