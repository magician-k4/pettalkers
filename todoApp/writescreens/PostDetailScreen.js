import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase-config'; // Firebase 인증 추가

const PostDetailScreen = ({ route, posts, setPosts, navigation }) => {
  const { post } = route.params;
  const [currentPost, setCurrentPost] = useState(post);
  const [commentText, setCommentText] = useState('');

  const user = auth.currentUser;

  // ✅ 추천 기능 추가 (로그인한 사용자만 가능)
  const handleToggleRecommend = () => {
    if (!user) {
      Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
      return;
    }

    let updatedPost;
    if (currentPost.recommendedBy.includes(user.email)) {
      // 이미 추천한 경우 → 추천 취소
      updatedPost = {
        ...currentPost,
        recommendations: currentPost.recommendations - 1,
        recommendedBy: currentPost.recommendedBy.filter((email) => email !== user.email),
      };
    } else {
      // 추천하지 않은 경우 → 추천 추가
      updatedPost = {
        ...currentPost,
        recommendations: currentPost.recommendations + 1,
        recommendedBy: [...currentPost.recommendedBy, user.email],
      };
    }

    setPosts(posts.map((item) => (item.id === currentPost.id ? updatedPost : item)));
    setCurrentPost(updatedPost);
  };

  // ✅ 댓글 추가 기능 (로그인한 사용자만 가능)
  const handleAddComment = () => {
    if (!user) {
      Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
      return;
    }

    if (!commentText.trim()) {
      Alert.alert("입력 오류", "댓글을 입력하세요.");
      return;
    }

    const updatedPost = {
      ...currentPost,
      comments: [
        ...currentPost.comments,
        { id: Date.now().toString(), text: commentText, authorEmail: user.email }
      ],
    };

    setPosts(posts.map((item) => (item.id === currentPost.id ? updatedPost : item)));
    setCurrentPost(updatedPost);
    setCommentText('');
  };

  return (
    <View style={styles.container}>
      {/* ✅ 제목 옆에 작성자의 이메일 표시 */}
      <Text style={styles.title}>{currentPost.title} <Text style={styles.author}>({currentPost.authorEmail})</Text></Text>
      <Text style={styles.content}>{currentPost.content}</Text>

      {/* ✅ 추천 버튼 (로그인한 사용자만 가능) */}
      <TouchableOpacity onPress={handleToggleRecommend} style={styles.recommendButton}>
        <Text style={styles.recommendText}>
          {currentPost.recommendedBy.includes(user?.email) ? '추천 취소' : '추천'} ({currentPost.recommendations})
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>댓글</Text>
      <FlatList
        data={currentPost.comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentAuthor}>{item.authorEmail}:</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      {/* ✅ 로그인한 사용자만 댓글 입력 가능 */}
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
  author: { fontSize: 16, color: '#666' },
  content: { fontSize: 16, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  comment: { padding: 8, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  commentAuthor: { fontWeight: 'bold', marginBottom: 4 },
  recommendButton: { marginVertical: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 8, alignItems: 'center' },
  recommendText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default PostDetailScreen;