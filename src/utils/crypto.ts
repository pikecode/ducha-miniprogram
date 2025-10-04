/**
 * 加密工具函数
 */

/**
 * Base64编码函数
 * @param str 要编码的字符串
 * @returns Base64编码后的字符串
 */
export function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Base64解码函数
 * @param str Base64编码的字符串
 * @returns 解码后的字符串
 */
export function base64Decode(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}