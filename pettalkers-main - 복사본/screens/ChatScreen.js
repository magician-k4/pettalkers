import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, db } from '../firebase-config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ChatScreen = ({ route }) => {
  const { chatRoomId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = auth.currentUser;
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc')); // 오름차순 정렬

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'chatRooms', chatRoomId, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        sender: user.email,
      });
      setNewMessage('');
    } catch (error) {
      console.error('메시지를 보내는 중 오류 발생:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.sender === user.email && styles.myMessage]}>
              <Text style={styles.messageSender}>{item.sender}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  myMessage: {
    backgroundColor: '#1e90ff',
    alignSelf: 'flex-end',
  },
  messageSender: { fontWeight: 'bold', fontSize: 14 },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 10 },
});

export default ChatScreen;
