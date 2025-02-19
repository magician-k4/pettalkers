/* PostDetailScreen.js */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const PostDetailScreen = ({ route, posts, setPosts, navigation }) => {
  const { post } = route.params;
  const [currentPost, setCurrentPost] = useState(post);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (!commentText.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    const updatedPost = {
      ...currentPost,
      comments: [...currentPost.comments, { id: Date.now().toString(), text: commentText }],
    };

    setPosts(posts.map((item) => (item.id === currentPost.id ? updatedPost : item)));
    setCurrentPost(updatedPost);
    setCommentText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentPost.title}</Text>
      <Text style={styles.content}>{currentPost.content}</Text>

      <Text style={styles.label}>댓글</Text>
      <FlatList
        data={currentPost.comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={commentText}
        onChangeText={setCommentText}
        placeholder="댓글을 입력하세요"
      />
      <Button title="댓글 추가" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  content: { fontSize: 16, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  comment: { padding: 8, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' }
});

export default PostDetailScreen;
