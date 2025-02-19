import { Text, View,TextInput,Pressable } from 'react-native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
    createStaticNavigation,
    useNavigation,
  } from '@react-navigation/native';
import TodoWriteScreen from './TodoWriteScreen';


export default TodoListScreen = ()=>{
    const navigation = useNavigation();
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>리스트 스크린</Text>
        <Button onPress={() => navigation.navigate('활동일지쓰기')}>
          활동일지쓰기
        </Button>
      </View>
    )
}
