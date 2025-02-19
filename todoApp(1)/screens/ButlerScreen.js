import React, {useState} from 'react';
import { Modal, StyleSheet, Text, Pressable, View,TextInput,} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export default function ButlerScreen(){
    const [modalVisible, setModalVisible] = useState(false);
    return(
        <SafeAreaProvider>
        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.header}>반려동물정보</Text>
                <TextInput placeholder='반려동물 이름' style={styles.textInput}></TextInput>
                <TextInput placeholder='종 종류' style={styles.textInput}></TextInput>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>추가하기 !</Text>
                </Pressable>
                
              </View>
            </View>
          </Modal>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>반려동물 추가하기</Text>
          </Pressable>
        </SafeAreaView>
      </SafeAreaProvider>
    )
}






const styles = StyleSheet.create({
    textInput: {    
        borderColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 36,
        width:300,
      },
      header: {
        color:'gray',
        fontWeight:'bold',
        textAlign:'center',
        fontSize: 26,
        marginBottom: 58,
      },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 125,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,

  },
});