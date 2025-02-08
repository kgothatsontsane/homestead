export const checkCookieSupport = () => {
  try {
    document.cookie = "cookietest=1";
    const result = document.cookie.indexOf("cookietest=") !== -1;
    document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
    return result;
  } catch (e) {
    return false;
  }
};

export const getCookiePreferences = () => {
  const preferences = localStorage.getItem("cookieConsent");
  if (!preferences) return null;
  return JSON.parse(preferences);
};

export const isCookieAllowed = (cookieType) => {
  const preferences = getCookiePreferences();
  if (!preferences) return false;
  return preferences[cookieType] || cookieType === "necessary";
};

export const getStorageType = () => {
  // First check if cookies are supported
  const cookiesSupported = checkCookieSupport();
  // Then check if cookie consent is given
  const preferences = getCookiePreferences();

  if (!cookiesSupported || !preferences?.functional) {
    return "localStorage";
  }
  return "cookies";
};
