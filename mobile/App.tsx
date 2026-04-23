import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'

/**
 * URL of your deployed Vite site (HTTPS). Set in `mobile/.env`:
 *   EXPO_PUBLIC_WEB_APP_URL=https://your-project.vercel.app
 * For a phone on the same Wi‑Fi as your PC during dev:
 *   EXPO_PUBLIC_WEB_APP_URL=http://192.168.x.x:5173
 */
function resolveWebAppUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_WEB_APP_URL?.trim()
  if (fromEnv) return fromEnv
  if (__DEV__) return 'http://127.0.0.1:5173'
  return 'https://example.com'
}

export default function App() {
  const uri = useMemo(() => resolveWebAppUrl(), [])
  const [loading, setLoading] = useState(true)
  const showPlaceholder = !__DEV__ && uri === 'https://example.com'

  if (showPlaceholder) {
    return (
      <View style={styles.center}>
        <ExpoStatusBar style="light" />
        <Text style={styles.title}>Set your site URL</Text>
        <Text style={styles.body}>
          Create `mobile/.env` with:{'\n\n'}
          EXPO_PUBLIC_WEB_APP_URL=https://your-app.vercel.app{'\n\n'}
          Or use EAS environment variables for cloud builds.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor="#0c3358" />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#5ba3f5" />
        </View>
      )}
      <WebView
        source={{ uri }}
        style={styles.web}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        allowsBackForwardNavigationGestures
        setSupportMultipleWindows={false}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        {...(Platform.OS === 'android' ? { mixedContentMode: 'always' as const } : {})}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f1118',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
  },
  web: {
    flex: 1,
    backgroundColor: '#0f1118',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1118',
    zIndex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: '#0f1118',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#c5d8f0',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  body: {
    color: '#9aa0a6',
    fontSize: 15,
    lineHeight: 22,
  },
})
