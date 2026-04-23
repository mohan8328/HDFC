/**
 * Build a debug APK using Gradle only (no Android Studio IDE).
 * Requires JDK 17+ and ANDROID_HOME / ANDROID_SDK_ROOT with a recent Android SDK.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const androidDir = path.resolve(__dirname, '..', 'android')
const isWin = process.platform === 'win32'
const gradlew = path.join(androidDir, isWin ? 'gradlew.bat' : 'gradlew')

const r = spawnSync(gradlew, ['assembleDebug', '--no-daemon'], {
  cwd: androidDir,
  stdio: 'inherit',
  shell: isWin,
  env: process.env,
})

if (r.status !== 0) {
  console.error('\nGradle failed. Install JDK 17+ and set ANDROID_HOME to your Android SDK.')
  console.error('Debug APK path on success: android/app/build/outputs/apk/debug/app-debug.apk\n')
  process.exit(r.status ?? 1)
}

console.log('\nDone. APK: android/app/build/outputs/apk/debug/app-debug.apk\n')
