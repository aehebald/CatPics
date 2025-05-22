import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, ActivityIndicator, SafeAreaView, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = Constants.expoConfig.extra.catApiKey;
const API_URL = 'https://api.thecatapi.com/v1/images/search';

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}?limit=10`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      setImages(prevImages => [...prevImages, ...response.data]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const toggleFavorite = (imageId) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      return newFavorites;
    });
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

  const favoriteImages = images.filter(image => favorites.has(image.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cat Pictures</Text>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => setShowFavorites(true)}
        >
          <Text style={styles.favoritesButtonText}>See Favorites</Text>
        </TouchableOpacity>
      </View>

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

      <Modal
        visible={showFavorites}
        animationType="slide"
        onRequestClose={() => setShowFavorites(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Favorite Images</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFavorites(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {favoriteImages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No favorite images yet</Text>
              <Text style={styles.emptySubText}>Add some favorites from the main screen!</Text>
            </View>
          ) : (
            <FlatList
              data={favoriteImages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  favoritesButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favoritesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 