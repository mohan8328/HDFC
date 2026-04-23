function postToNative(payload) {
  try {
    window.ReactNativeWebView?.postMessage(JSON.stringify(payload))
  } catch {
    /* payload too large */
  }
}

/**
 * Triggers a file download. In the Expo WebView, `<a download>` is ignored, so we
 * base64 the blob and let native code write + open the share sheet.
 */
export function downloadBlob(blob, filename) {
  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    const reader = new FileReader()
    reader.onerror = () => {
      postToNative({ type: 'DOWNLOAD_BLOB_ERROR', message: 'Could not read file for download.' })
    }
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result !== 'string' || !result.includes(',')) {
        postToNative({ type: 'DOWNLOAD_BLOB_ERROR', message: 'Invalid file data.' })
        return
      }
      const base64 = result.slice(result.indexOf(',') + 1)
      postToNative({
        type: 'DOWNLOAD_BLOB',
        filename,
        mime: blob.type || 'application/octet-stream',
        data: base64,
      })
    }
    reader.readAsDataURL(blob)
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
