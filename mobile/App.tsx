import { useMemo, useState, useCallback, useEffect } from 'react'
import {
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
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
  const webHost = useMemo(() => {
    try {
      return new URL(uri).hostname
    } catch {
      return ''
    }
  }, [uri])
  /** Only until first document load. SPA route changes can fire `onLoadStart` without `onLoadEnd`, which would leave a full-screen overlay and block taps. */
  const [bootLoading, setBootLoading] = useState(true)
  const showPlaceholder = !__DEV__ && uri === 'https://example.com'

  const finishBootLoading = useCallback(() => {
    setBootLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(finishBootLoading, 15000)
    return () => clearTimeout(t)
  }, [finishBootLoading])

  const onNavigationStateChange = useCallback(
    (nav: { url?: string; loading?: boolean }) => {
      if (nav.loading) return
      const u = nav.url ?? ''
      if (!u || u.startsWith('about:')) return
      if (!webHost || u.includes(webHost)) finishBootLoading()
    },
    [webHost, finishBootLoading],
  )

  const onBridgeMessage = useCallback(async (event: { nativeEvent: { data: string } }) => {
    let msg: { type?: string; filename?: string; mime?: string; data?: string; message?: string }
    try {
      msg = JSON.parse(event.nativeEvent.data) as typeof msg
    } catch {
      return
    }
    if (msg.type === 'DOWNLOAD_BLOB_ERROR') {
      Alert.alert('Statement download', msg.message ?? 'Something went wrong.')
      return
    }
    if (msg.type !== 'DOWNLOAD_BLOB' || !msg.data || !msg.filename) return
    const baseDir = FileSystem.cacheDirectory
    if (!baseDir) {
      Alert.alert('Statement download', 'App cache is not available on this device.')
      return
    }
    const safe = msg.filename.replace(/[^\w.-]+/g, '_')
    const path = `${baseDir}hdfc-${Date.now()}-${safe}`
    try {
      await FileSystem.writeAsStringAsync(path, msg.data, {
        encoding: FileSystem.EncodingType.Base64,
      })
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, {
          mimeType: msg.mime ?? 'application/pdf',
          dialogTitle: 'Save or open statement',
        })
      } else {
        Alert.alert('Statement saved', path)
      }
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Unknown error'
      Alert.alert('Statement download', err)
    }
  }, [])

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
      {bootLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#5ba3f5" />
        </View>
      )}
      <WebView
        source={{ uri }}
        style={styles.web}
        onLoadEnd={finishBootLoading}
        onError={finishBootLoading}
        onHttpError={finishBootLoading}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onBridgeMessage}
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
