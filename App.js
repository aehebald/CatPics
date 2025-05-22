import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, ActivityIndicator, SafeAreaView, Text } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig.extra.catApiKey;
const API_URL = 'https://api.thecatapi.com/v1/images/search';

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
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
      <Text style={styles.title}>Cat Pictures</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
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
}); 