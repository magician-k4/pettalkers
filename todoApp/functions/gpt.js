import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const BOTPRESS_URL = "https://cdn.botpress.cloud/webchat/v1/index.html";
const clientId = "bc0ef7f2-db74-45b0-a362-615e6cdd0556"; // 본인의 Client ID 사용

export default function App() {
  return (
    <View style={{ flex: 1 }}> 
      <WebView
        source={{ uri: `${BOTPRESS_URL}?clientId=${clientId}` }}
        style={{ flex: 1 }} // 전체 화면을 차지하도록 설정
      />
    </View>
  );
}
