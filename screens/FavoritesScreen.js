import React from 'react';
import { StyleSheet, View, Image, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen() {
  const { favorites, images, toggleFavorite } = useFavorites();

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

  const favoriteImages = images.filter(image => favorites.has(image.id));

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
            name="heart"
            size={24}
            color="#ff4444"
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

  return (
    <View style={styles.container}>
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
    </View>
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