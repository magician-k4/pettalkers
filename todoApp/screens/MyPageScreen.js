import { Text, View, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/core';




export default function MyPageScreen(){
       const navigation = useNavigation();
       const Stack = createNativeStackNavigator();
    return (
        

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20 }}>
            <Pressable>
                <Text onPress={() => navigation.navigate('집사정보')} style={{
                    fontSize:17,
                    padding: 10,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    borderWidth: 1,
                    width: 405, // 문자열 대신 숫자로 수정
                    height: 50, // 문자열 대신 숫자로 수정
                    textAlign: "center",
                    lineHeight: 30, // 텍스트를 버튼 높이와 맞춤
                }}>
                  <MaterialIcons name="pets" size={24} color="black" /> 내 반려동물</Text>
                                    
                <Text style={{
                    fontSize:17,
                    padding: 10,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    borderWidth: 1,
                    width: 405,
                    height: 50,
                    textAlign: "center",
                    lineHeight: 30,
                    marginTop: 10 // 버튼 간격 조정
                }}>
                  <MaterialCommunityIcons name="information-outline" size={24} color="black" /> 계정 정보</Text>

<Text style={{      
                    fontSize:17,
                    padding: 10,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    borderWidth: 1,
                    width: 405,
                    height: 50,
                    textAlign: "center",
                    lineHeight: 30,
                    marginTop: 10 // 버튼 간격 조정
                }}>
                  <Octicons name="bell" size={24} color="black" /> 문의하기</Text>
            </Pressable>
        </View>


    );
}
