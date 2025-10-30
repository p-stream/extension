// Type declarations for Orion/Safari webkit APIs
declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        kagiEvents?: any;
        base?: any;
        [key: string]: any;
      };
    };
  }
}

export const isChrome = () => {
  return chrome.runtime.getURL('').startsWith('chrome-extension://');
};

export const isFirefox = () => {
  try {
    return browser.runtime.getURL('').startsWith('moz-extension://');
  } catch {
    return false;
  }
};

export const isSafari = () => {
  try {
    // Check for standard Safari scheme
    const hasSafariScheme = chrome.runtime.getURL('').startsWith('safari-web-extension://') ||
    browser.runtime.getURL('').startsWith('safari-web-extension://')

    // Check for Orion (which loads Safari extensions with chrome-extension:// scheme)
    const isOrion = typeof window !== 'undefined' &&
      window.webkit &&
      window.webkit.messageHandlers;

    return hasSafariScheme || isOrion;
  } catch {
    return false;
  }
};

export const getBrowserAPI = () => {
  if (isSafari()) {
    return typeof browser !== 'undefined' ? browser : chrome;
  }
  if (isFirefox()) {
    return browser;
  }
  return chrome;
};
