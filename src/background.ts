import '@plasmohq/messaging/background';
import { getBrowserAPI, isChrome, isFirefox, isSafari } from '~utils/extension';

const browserAPI = getBrowserAPI();

if (isSafari()) {
  // Safari doesn't need the reload behavior that Chrome/Firefox require
  console.log('Running on Safari');

  // Ensure messaging is ready for Safari
  browserAPI.runtime.onInstalled.addListener(() => {
    console.log('Safari extension installed/updated');
    // Give Safari time to initialize messaging
    setTimeout(() => {
      console.log('Safari messaging should be ready');
    }, 1000);
  });

  // Handle Safari runtime errors more gracefully
  browserAPI.runtime.onConnect.addListener((port) => {
    console.log('Safari port connected:', port.name);
    port.onDisconnect.addListener(() => {
      if (browserAPI.runtime.lastError) {
        console.log('Safari port disconnected with error:', browserAPI.runtime.lastError.message);
      }
    });
  });
} else if (isChrome()) {
  // Both brave and chrome for some reason need this extension reload,
  // If this isn't done, they will never load properly and will fail updateDynamicRules()
  chrome.runtime.onStartup.addListener(() => {
    chrome.runtime.reload();
  });

  chrome.runtime.onInstalled.addListener(() => {
    console.log('Chrome extension installed/updated');
  });
} else if (isFirefox()) {
  // Firefox behavior
  browser.runtime.onStartup.addListener(() => {
    browser.runtime.reload();
  });

  browser.runtime.onInstalled.addListener(() => {
    console.log('Firefox extension installed/updated');
  });
}
