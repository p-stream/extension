import { relayMessage } from '@plasmohq/messaging';
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

// Safari requires a delay before setting up messaging
const isSafari = () => {
  try {
    return (
      chrome.runtime.getURL('').startsWith('safari-web-extension://') ||
      (typeof browser !== 'undefined' && browser.runtime.getURL('').startsWith('safari-web-extension://'))
    );
  } catch {
    return false;
  }
};

const setupMessaging = () => {
  try {
    relayMessage({
      name: 'hello',
    });

    relayMessage({
      name: 'makeRequest',
    });

    relayMessage({
      name: 'prepareStream',
    });

    relayMessage({
      name: 'openPage',
    });
  } catch (error) {
    console.log('Failed to setup messaging, retrying...', error);
    setTimeout(setupMessaging, 1000);
  }
};

// Safari needs a delay to ensure background script is ready
if (isSafari()) {
  setTimeout(setupMessaging, 500);
} else {
  setupMessaging();
}
