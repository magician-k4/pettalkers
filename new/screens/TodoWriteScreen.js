import { Text, View, TextInput, Pressable, Alert, StyleSheet, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { auth, db } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';

export default function TodoWriteScreen({ navigation }) {
  const [todo, setTodo] = useState('');
  const [alarmTime, setAlarmTime] = useState(new Date(Date.now() + 60 * 1000)); // 기본값: 1분 후
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    Notifications.requestPermissionsAsync(); // 알림 권한 요청
  }, []);

  const handleAddTodo = async () => {
  if (!todo.trim()) {
    Alert.alert("할 일을 입력해주세요.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ 활동 알림',
        body: todo,
        sound: true,
      },
      trigger: alarmTime,
    });

    // ✅ Firestore 저장 시 userId 추가
    await addDoc(collection(db, 'todos'), {
      text: todo,
      authorEmail: user.email,
      userId: user.uid, // ✅ 중요!
      createdAt: new Date(),
      alarmTime: alarmTime,
      notificationId,
    });

    Alert.alert('할 일이 추가되었고 알람도 설정되었습니다!');
    navigation.goBack(); // TodoList로 정상 복귀

  } catch (err) {
    Alert.alert('오류 발생', err.message);
  }
};


  const handleCancel = () => {
    setTodo('');
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const newDate = new Date(alarmTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setAlarmTime(newDate);
      setShowTimePicker(true); // 날짜 설정 후 시간 선택기로 전환
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      const newDate = new Date(alarmTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      newDate.setSeconds(0);
      setAlarmTime(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        multiline
        onChangeText={setTodo}
        value={todo}
        placeholder="활동 내용을 기록해주세요 :)"
        style={styles.textInput}
      />

      {/* 알람 시간 선택 */}
      <Pressable onPress={() => setShowDatePicker(true)} style={styles.timeButton}>
        <Text style={styles.buttonText}>
          알림 시간: {alarmTime.toLocaleString()}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={alarmTime}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={alarmTime}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <Pressable onPress={handleAddTodo} style={styles.button}>
          <Text style={styles.buttonText}>작성 + 알람</Text>
        </Pressable>
        <Pressable onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>취소</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  textInput: {
    width: '100%',
    height: 300,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#17a2b8',
    borderRadius: 10,
    alignItems: 'center',
  },
});
