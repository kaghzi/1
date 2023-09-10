export default class Utf8Base64Converter {
  static encodeToBase64(utf8String) {
    const encoded = btoa(unescape(encodeURIComponent(utf8String)));
    return encoded;
  }

  static decodeFromBase64(base64String) {
    const decoded = decodeURIComponent(escape(atob(base64String)));
    return decoded;
  }
}