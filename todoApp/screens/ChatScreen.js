import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, db } from '../firebase-config';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ChatScreen = ({ route }) => {
  const { chatRoomId } = route.params; // 채팅방 ID를 받아옵니다.
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = auth.currentUser;

  // 채팅방 메시지 실시간 업데이트
  useEffect(() => {
    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
    const q = query(messagesRef, where('chatRoomId', '==', chatRoomId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(fetchedMessages);  // 메시지가 제대로 가져오는지 확인
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  // 메시지 보내기
  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const messageRef = await addDoc(collection(db, 'chatRooms', chatRoomId, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(), // Firestore 서버 시간 사용
        sender: user.email,
      });
      // 메시지를 추가한 후 새로운 메시지를 메시지 목록에 반영
      setMessages((prevMessages) => [
        { id: messageRef.id, text: newMessage, sender: user.email },
        ...prevMessages,  // 기존 메시지 목록 앞에 새로운 메시지를 추가
      ]);
      setNewMessage('');  // 메시지 입력란 초기화
    } catch (error) {
      console.error('메시지를 보내는 중 오류 발생:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}  // 데이터를 반전시켜서 최신 메시지가 아래로 오게 하지 않음
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.messageSender}>{item.sender}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="메시지를 입력하세요"
        />
        <Button title="전송" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', backgroundColor: '#fff' },
  chatContainer: { flex: 1, padding: 16 },
  messageContainer: { marginBottom: 12 },
  messageSender: { fontWeight: 'bold', fontSize: 14 },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 10 },
});

export default ChatScreen;
