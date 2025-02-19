/* WriteScreen.js */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const WriteScreen = ({ posts, setPosts, navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      recommendations: 0,
      recommendedBy: [],
      comments: []
    };
    setPosts([newPost, ...posts]);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
      />
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder="내용을 입력하세요"
        multiline
      />
      <Button title="작성 완료" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  textArea: { height: 100 }
});

export default WriteScreen;

