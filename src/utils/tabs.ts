import { getBrowserAPI } from './extension';

export function queryCurrentDomain(cb: (domain: string | null) => void) {
  const handle = (tabUrl: string | undefined) => {
    if (!tabUrl) cb(null);
    else cb(tabUrl);
  };
  const ops = { active: true, currentWindow: true } as const;
  const browserAPI = getBrowserAPI();
  (browserAPI.tabs as any).query(ops).then((tabs: any[]) => handle(tabs[0]?.url));
}

export function listenToTabChanges(cb: () => void) {
  const browserAPI = getBrowserAPI();
  (browserAPI.tabs as any).onActivated.addListener(cb);
  (browserAPI.tabs as any).onUpdated.addListener(cb);
}

export function stopListenToTabChanges(cb: () => void) {
  const browserAPI = getBrowserAPI();
  (browserAPI.tabs as any).onActivated.removeListener(cb);
  (browserAPI.tabs as any).onUpdated.removeListener(cb);
}
