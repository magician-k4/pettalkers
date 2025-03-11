import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, db, storage } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const WriteScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가

  // ✅ 이미지 선택 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ 게시글 저장 함수 (이미지 업로드 포함)
  // 이미지 업로드와 Firestore에 데이터 저장 처리 부분
const handleSubmit = async () => {
  if (!title.trim() || !content.trim()) {
    Alert.alert('입력 오류', '제목과 내용을 입력하세요.');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
    return;
  }

  setLoading(true);

  let imageUrl = '';
  if (image) {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, `images/${Date.now()}_${user.email}`);
      await uploadBytes(storageRef, blob); // 이미지 업로드

      // 업로드 완료 후 이미지 URL 가져오기
      imageUrl = await getDownloadURL(storageRef);
    } catch (error) {
      setLoading(false);
      Alert.alert('오류', '이미지를 업로드하는 중 문제가 발생했습니다.');
      console.error(error);
      return;
    }
  }

  const newPost = {
    title,
    content,
    imageUrl, // 이미지 URL 추가
    recommendations: 0,
    recommendedBy: [],
    comments: [],
    authorEmail: user.email,
    createdAt: new Date().getTime(),
  };

  try {
    await addDoc(collection(db, 'posts'), newPost);
    Alert.alert('작성 완료', '게시글이 성공적으로 등록되었습니다.', [
      {
        text: '확인',
        onPress: () => navigation.navigate('게시판'),
      },
    ]);
  } catch (error) {
    Alert.alert('오류', '게시글을 저장하는 중 문제가 발생했습니다.');
    console.error(error);
  } finally {
    setLoading(false); // 로딩 종료
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="제목을 입력하세요" />

      <Text style={styles.label}>내용</Text>
      <TextInput style={[styles.input, styles.textArea]} value={content} onChangeText={setContent} placeholder="내용을 입력하세요" multiline />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>이미지 선택</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      {/* ✅ 로딩 중이면 버튼 비활성화 & 로딩 표시 */}
      {loading ? (
        <ActivityIndicator size="large" color="#1a73e8" />
      ) : (
        <Button title="작성 완료" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  textArea: { height: 100 },
  imagePicker: { backgroundColor: '#ddd', padding: 10, alignItems: 'center', marginBottom: 10 },
  imagePickerText: { color: '#333' },
  previewImage: { width: '100%', height: 200, marginBottom: 10, borderRadius: 8 },
});

export default WriteScreen;
