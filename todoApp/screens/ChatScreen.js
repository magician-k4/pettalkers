import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase-config';
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    const messagesRef = collection(db, 'chats');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    await addDoc(collection(db, 'chats'), {
      text: messageText,
      senderEmail: user.email,
      timestamp: serverTimestamp()
    });
    
    setMessageText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.sender}>{item.senderEmail}:</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={messageText}
        onChangeText={setMessageText}
        placeholder="메시지를 입력하세요"
      />
      <Button title="전송" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  messageContainer: { padding: 8, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  sender: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }
});

export default ChatScreen;
