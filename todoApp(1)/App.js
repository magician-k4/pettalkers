import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// 페이지 import
import TodoListScreen from './screens/TodoListScreen';
import TodoWriteScreen from './screens/TodoWriteScreen';
import MyPageScreen from './screens/MyPageScreen';
import HomeScreen from './screens/HomeScreen';
import ButlerScreen from './screens/ButlerScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import BoardScreen from './writescreens/BoardScreen';
import WriteScreen from './writescreens/WriteScreen';
import PostDetailScreen from './writescreens/PostDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="활동일지"
          component={TodoStackScreen}
          options={{
            title: '활동일지',
            headerTitleAlign: 'center',
            tabBarIcon: ({ focused }) => (
              <Entypo name="open-book" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '메인 홈',
            headerTitleAlign: 'center',
            tabBarIcon: ({ focused }) => (
              <AntDesign name="home" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="게시판"
          component={BoardStackScreen}
          options={{
            title: '게시판',
            headerTitleAlign: 'center',
            tabBarIcon: ({ focused }) => (
              <FontAwesome6 name="clipboard-list" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="내정보"
          component={MyPageStackScreen}
          options={{
            title: '마이 페이지',
            headerTitleAlign: 'center',
            tabBarIcon: ({ focused }) => (
              <FontAwesome6 name="circle-user" size={24} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// 활동일지 네비게이션
function TodoStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="활동일지"
        component={TodoListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="활동일지쓰기"
        component={TodoWriteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="집사정보"
        component={ButlerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// 마이페이지 네비게이션
function MyPageStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="마이페이지"
        component={MyPageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="집사정보"
        component={ButlerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// 게시판 네비게이션
function BoardStackScreen() {
  return (
    <Stack.Navigator>
     <Stack.Screen 
          name="게시판" 
          component={BoardScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="게시글 작성" 
          component={WriteScreen}  // ✅ WriteScreen이 여기에 있어야 함
        />
        <Stack.Screen 
          name="게시글 상세" 
          component={PostDetailScreen} 
        />
      
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
 
}
export default App;  // 여기서만 App을 export합니다.
