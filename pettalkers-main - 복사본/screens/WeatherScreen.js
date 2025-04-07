import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { WEATHER_API_KEY } from "@env";
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const weatherApiKey = WEATHER_API_KEY;

// 날짜 포맷 Hook
const useRegDate = () => {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let date2 = date.getDate();
    let day = date.getDay();

    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;

    const hoursString = hours < 10 ? `0${hours}` : hours;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;

    const dayOfTheWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const formattedDate = `${year}년 ${month}월 ${date2}일 (${dayOfTheWeek[day]}) ${hoursString}:${minutesString} ${ampm}`;

    setCurrentDate(formattedDate);
  }, []);

  return currentDate;
};

// 반려동물 팁
const petCareTips = {
  "clear": "오늘은 맑아요! 반려동물과 산책하기 좋은 날이에요.",
  "clouds": "구름이 많아요. 반려동물이 불안해할 수 있어요.",
  "rain": "비가 많이 와요! 반려동물을 실내에서 보호해주세요.",
  "thunderstorm": "천둥번개가 칩니다. 반려동물이 무서워할 수 있어요!",
  "snow": "눈이 내려요! 발바닥 보호를 위해 신발을 신겨주세요.",
  "mist": "안개가 껴서 시야가 나빠요. 산책 시 주의하세요."
};

const getTemperatureTip = (temp) => {
  if (temp >= 30) return "더운 날이에요! 반려동물이 더위를 먹지 않도록 충분한 물을 주세요.";
  if (temp >= 20) return "적당한 기온이에요! 산책하기 딱 좋은 날이에요.";
  if (temp >= 10) return "조금 쌀쌀해요. 반려동물이 추위를 느낄 수 있어요.";
  return "추운 날이에요! 반려동물이 따뜻하게 지낼 수 있도록 해주세요.";
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permitted, setPermitted] = useState(true);
  const [city, setCity] = useState(null);
  const [dailyWeather, setDailyWeather] = useState([]);
  const currentDate = useRegDate();

  const locationData = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setPermitted(false);
      setErrorMsg('위치에 대한 권한 부여가 거부되었습니다.');
      return;
    }

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const address = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    const cityAdress = address[0].city;
    setCity(cityAdress);

    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&lang=kr&appid=${weatherApiKey}`;
    const respToWeather = await fetch(weatherApiUrl);
    const jsonForWeahter = await respToWeather.json();

    setDailyWeather(jsonForWeahter.daily);
  };

  useEffect(() => {
    locationData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        <Text style={styles.city}>{city}</Text>
      </View>
      <View style={styles.regDateCon}>
        <Text style={styles.regDate}>{currentDate}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.weather}
      >
        {!Array.isArray(dailyWeather) || dailyWeather.length === 0 ? (
          <View style={styles.weatherInner}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          dailyWeather.map((day, index) => {
            const weatherMain = day.weather[0].main.toLowerCase();
            const tip = petCareTips[weatherMain] || "오늘 날씨에 맞는 팁을 준비 중이에요.";
            const tempTip = getTemperatureTip(day.temp.day);

            return (
              <View key={index} style={styles.weatherInner}>
                <View style={styles.day}>
                  <Text style={styles.desc}>{day.weather[0].description}</Text>
                </View>
                <View style={styles.tempCon}>
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(0)}°
                  </Text>
                  <Text style={styles.tip}>{tip}</Text>
                  <Text style={styles.tip}>{tempTip}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe01a',
  },
  cityCon: {
    flex: 0.4,
  },
  city: {
    flex: 1,
    marginTop: 70,
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  regDateCon: {
    alignItems: 'center',
  },
  regDate: {
    padding: 10,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 20,
    fontWeight: "bold",
  },
  weather: {},
  weatherInner: {
    flex: 3,
    width: SCREEN_WIDTH,
    padding: 20,
    justifyContent: 'center',
  },
  day: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    flex: 1.5,
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: 'center',
  },
  tempCon: {
    flex: 0.5,
    alignItems: "center",
    marginTop: 20,
  },
  temp: {
    fontSize: 120,
  },
  tip: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  }
});
