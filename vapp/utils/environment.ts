import { Environment } from '~/enums'

export const getEnvironment = (): Environment => {
  const userAgent = navigator.userAgent || navigator.vendor

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return Environment.WindowsPhone
  }

  if (/Android/i.test(userAgent)) {
    return Environment.Android
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return Environment.Ios
  }

  if (/Chrome/.test(userAgent)) {
    return Environment.Chromium
  }

  return Environment.Unknown
}
