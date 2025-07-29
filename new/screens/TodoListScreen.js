import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import * as Notifications from 'expo-notifications';

export default function TodoListScreen({ navigation }) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTodos();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchTodos = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, 'todos'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const todoList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todoList);
    } catch (error) {
      Alert.alert('불러오기 실패', error.message);
    }
  };

  const handleDelete = async (todoId, notificationId) => {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      await deleteDoc(doc(db, 'todos', todoId));
      fetchTodos();
      Alert.alert('삭제 완료', '할 일과 알림이 삭제되었습니다.');
    } catch (error) {
      Alert.alert('삭제 실패', error.message);
    }
  };

  const renderItem = ({ item }) => {
    const alarmTimeStr = item.alarmTime
      ? new Date(item.alarmTime.seconds * 1000).toLocaleString()
      : '없음';

    return (
      <View style={styles.todoItem}>
        <Text style={styles.postText}>{item.text}</Text>
        <Text style={styles.alarmTime}>작성일: {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</Text>
        <Text style={styles.alarmTime}>알림 시간: {alarmTimeStr}</Text>
        <Button
          title="삭제"
          color="red"
          onPress={() => handleDelete(item.id, item.notificationId)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>할 일 목록</Text>
      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('활동일지쓰기')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  todoItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  postText: {
    fontSize: 18,
    marginBottom: 5,
  },
  alarmTime: {
    fontSize: 14,
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
  },
});
