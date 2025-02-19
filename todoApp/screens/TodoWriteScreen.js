import { Text, View,TextInput,Pressable,Alert,StyleSheet } from 'react-native';
import React from 'react';
import { useState,useRef } from 'react';



export default TodoWriteScreen = ({navigation}) =>{
    const [todo,setTodo] = useState('');

    const handleAddTodo = () => {
      if (!todo.trim()) {
        Alert.alert("할 일을 입력해주세요.");
        return;
      }
      
    };

    return(
     <>
 <TextInput
           multiline
           onChangeText={setTodo}
           value={todo}
           placeholder="활동내용을 기록해주세요 :)"
           style = {styles.textInput}
         />
         <Pressable onPress = {handleAddTodo}><Text style ={styles.onPress}>작성</Text>
         </Pressable>
      </>   
    )
 }
 

 const styles = StyleSheet.create({
  textInput:{
             flex:0.3,
             padding:10,
             backgroundColor:"#fff",
             borderRadius:10,
             borderWidth:2,
             margin:10,
  },
  onPress:{
    padding:10,
    backgroundColor:"#fff",
    borderRadius:10,
    borderWidth:2,
    width:"30%",
    textAlign:"center",
    fontWeight:"bold",
    margin:10,
  }
 })