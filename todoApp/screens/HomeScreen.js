import { Text, View, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase-config'; // 이제 이 파일을 사용합니다.

export default function HomeScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Firebase 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);  // 로그인 상태일 경우
      } else {
        setIsLoggedIn(false); // 로그아웃 상태일 경우
      }
    });

    return () => unsubscribe();  // 컴포넌트 언마운트 시 구독 해제
  }, []);

  const handleChatNavigation = () => {
    if (isLoggedIn) {
      navigation.navigate('Chat');
    } else {
      Alert.alert('로그인 필요', '실시간 채팅을 이용하려면 로그인해야 합니다.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>메인 화면</Text>
      
      {/* 게임 시작 버튼 */}
      <Button title="게임 시작하기" onPress={() => navigation.navigate('Game')} />
      
      {/* 날씨 보기 버튼 */}
      <Button title="날씨 보기" onPress={() => navigation.navigate('Weather')} />

      {/* 실시간 채팅 버튼 */}
      <Button title="실시간 채팅" onPress={handleChatNavigation} />
    </View>
  );
}
