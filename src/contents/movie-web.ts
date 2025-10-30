import { relayMessage } from '@plasmohq/messaging';
import type { PlasmoCSConfig } from 'plasmo';
import { isSafari } from '~utils/extension';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
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
