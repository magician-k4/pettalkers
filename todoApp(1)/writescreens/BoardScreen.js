/* BoardScreen.js */
import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderButtons from '../components/HeaderButtons';

const BoardScreen = ({ posts, setPosts }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderButtons />
      <Button title="글쓰기" onPress={() => navigation.navigate('게시글 작성')} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('게시글 상세', { post: item })}>
            <View style={styles.post}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postRecommendations}>추천 수: {item.recommendations}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  post: { marginBottom: 16, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  postTitle: { fontSize: 18, fontWeight: 'bold' },
  postRecommendations: { color: '#888' }
});

export default BoardScreen;