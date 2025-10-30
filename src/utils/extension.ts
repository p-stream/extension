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
    return (
      chrome.runtime.getURL('').startsWith('safari-web-extension://') ||
      browser.runtime.getURL('').startsWith('safari-web-extension://')
    );
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
