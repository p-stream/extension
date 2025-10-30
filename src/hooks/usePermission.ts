import { useCallback, useEffect, useState } from 'react';

import { getBrowserAPI, isSafari } from '~utils/extension';

import { useDomainWhitelist } from './useDomainWhitelist';

export async function hasPermission() {
  const browserAPI = getBrowserAPI();

  if (isSafari()) {
    try {
      const tabs = await (browserAPI.tabs as any).query({
        active: true,
        currentWindow: true,
      });
      return tabs && tabs.length > 0;
    } catch (error) {
      console.log('Safari permission check failed:', error);
      return false;
    }
  }

  try {
    return await (browserAPI.permissions as any).contains({
      origins: ['<all_urls>'],
    });
  } catch (error) {
    console.log('Permission check failed:', error);
    return false;
  }
}

export function usePermission() {
  const { addDomain } = useDomainWhitelist();
  const [permission, setPermission] = useState(false);

  const grantPermission = useCallback(
    async (domain?: string) => {
      const browserAPI = getBrowserAPI();

      if (isSafari()) {
        const hasPerms = await hasPermission();
        if (!hasPerms) {
          // eslint-disable-next-line no-alert
          alert(
            'To use this extension, please:\n\n' +
              '1. Open Safari Preferences\n' +
              '2. Go to the Websites tab\n' +
              '3. Find "P-Stream extension" in the left sidebar\n' +
              '4. Set it to "Allow" for the websites you want to use\n\n' +
              'You may also need to enable the extension in Safari > Preferences > Extensions',
          );
          return false;
        }
        setPermission(true);
        if (domain) addDomain(domain);
        return true;
      }

      try {
        const granted = await (browserAPI.permissions as any).request({
          origins: ['<all_urls>'],
        });
        setPermission(granted);
        if (granted && domain) addDomain(domain);
        return granted;
      } catch (error) {
        console.log('Permission request failed:', error);
        return false;
      }
    },
    [addDomain],
  );

  useEffect(() => {
    hasPermission().then((has) => setPermission(has));
  }, []);

  return {
    hasPermission: permission,
    grantPermission,
  };
}
