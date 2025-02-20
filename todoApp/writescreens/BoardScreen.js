import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderButtons from '../components/HeaderButtons';
import { auth } from '../firebase-config'; // Firebase 설정 import
import { Alert } from 'react-native';

const BoardScreen = ({ posts, setPosts }) => {
  const navigation = useNavigation();

  const handleWritePress = () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
      return;
    }
    navigation.navigate('게시글 작성');
  };

  return (
    <View style={styles.container}>
      <HeaderButtons />
      <Button title="글쓰기" onPress={handleWritePress} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('게시글 상세', { post: item })}>
            <View style={styles.post}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postRecommendations}>추천 수: {item.recommendations}</Text>
              <Text style={styles.postAuthor}>작성자: {item.authorEmail || '익명'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  post: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postTitle: { fontSize: 18, fontWeight: 'bold' },
  postRecommendations: { color: '#888' },
  postAuthor: { fontSize: 14, color: '#555', marginTop: 4 },
});

export default BoardScreen;
