/* HeaderButtons.js */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderButtons = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.headerButton}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.headerButton}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtons: { flexDirection: 'row', justifyContent: 'flex-end', padding: 10 },
  headerButton: { fontSize: 16, color: '#1a73e8', marginLeft: 10 }
});

export default HeaderButtons;
