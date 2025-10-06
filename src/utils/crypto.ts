/**
 * 加密工具函数
 */

// Base64编码字符表
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

/**
 * 检查是否支持原生btoa函数
 */
function supportsBtoa(): boolean {
  try {
    return typeof btoa !== 'undefined' && typeof btoa === 'function'
  } catch (e) {
    return false
  }
}

/**
 * 手动实现的base64编码函数（兼容小程序环境）
 * @param input 要编码的字符串
 * @returns Base64编码后的字符串
 */
function manualBase64Encode(input: string): string {
  let output = ''
  let i = 0

  while (i < input.length) {
    const a = input.charCodeAt(i++)
    const b = i < input.length ? input.charCodeAt(i++) : 0
    const c = i < input.length ? input.charCodeAt(i++) : 0

    const bitmap = (a << 16) | (b << 8) | c

    output += BASE64_CHARS.charAt((bitmap >> 18) & 63)
    output += BASE64_CHARS.charAt((bitmap >> 12) & 63)
    output += BASE64_CHARS.charAt((bitmap >> 6) & 63)
    output += BASE64_CHARS.charAt(bitmap & 63)
  }

  // 处理填充
  const padLength = (3 - (input.length % 3)) % 3
  if (padLength > 0) {
    output = output.slice(0, -padLength) + '='.repeat(padLength)
  }

  return output
}

/**
 * UTF-8编码函数
 * @param str 要编码的字符串
 * @returns UTF-8编码后的字符串
 */
function utf8Encode(str: string): string {
  try {
    // 尝试使用标准方法
    return unescape(encodeURIComponent(str))
  } catch (e) {
    // 如果不支持，使用手动实现
    let result = ''
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i)
      if (code < 128) {
        result += String.fromCharCode(code)
      } else if (code < 2048) {
        result += String.fromCharCode(192 | (code >> 6))
        result += String.fromCharCode(128 | (code & 63))
      } else {
        result += String.fromCharCode(224 | (code >> 12))
        result += String.fromCharCode(128 | ((code >> 6) & 63))
        result += String.fromCharCode(128 | (code & 63))
      }
    }
    return result
  }
}

/**
 * Base64编码函数
 * @param str 要编码的字符串
 * @returns Base64编码后的字符串
 */
export function base64Encode(str: string): string {
  try {
    // 首先进行UTF-8编码
    const utf8Str = utf8Encode(str)

    // 尝试使用原生btoa函数
    if (supportsBtoa()) {
      return btoa(utf8Str)
    }

    // 使用手动实现的base64编码
    return manualBase64Encode(utf8Str)
  } catch (error) {
    console.error('Base64编码失败:', error)

    // 最后的兜底方案：使用手动实现
    const utf8Str = utf8Encode(str)
    return manualBase64Encode(utf8Str)
  }
}

/**
 * Base64解码函数
 * @param str Base64编码的字符串
 * @returns 解码后的字符串
 */
export function base64Decode(str: string): string {
  try {
    // 尝试使用原生atob函数
    if (typeof atob !== 'undefined' && typeof atob === 'function') {
      return decodeURIComponent(escape(atob(str)))
    }

    // 如果不支持原生函数，可以在这里实现手动解码
    // 暂时返回原字符串

    return str
  } catch (error) {
    console.error('Base64解码失败:', error)
    return str
  }
}