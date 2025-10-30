import { getBrowserAPI, isChrome, isSafari } from './extension';

interface DynamicRule {
  ruleId: number;
  targetDomains?: [string, ...string[]];
  targetRegex?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

const mapHeadersToDeclarativeNetRequestHeaders = (
  headers: Record<string, string>,
  op: string,
): { header: string; operation: any; value: string }[] => {
  return Object.entries(headers).map(([name, value]) => ({
    header: name,
    operation: op,
    value,
  }));
};

export const setDynamicRules = async (body: DynamicRule) => {
  const browserAPI = getBrowserAPI();

  if (isChrome() || isSafari()) {
    await (browserAPI.declarativeNetRequest as any).updateDynamicRules({
      removeRuleIds: [body.ruleId],
      addRules: [
        {
          id: body.ruleId,
          condition: {
            ...(body.targetDomains && { requestDomains: body.targetDomains }),
            ...(body.targetRegex && { regexFilter: body.targetRegex }),
          },
          action: {
            type: 'modifyHeaders',
            ...(body.requestHeaders && Object.keys(body.requestHeaders).length > 0
              ? {
                  requestHeaders: mapHeadersToDeclarativeNetRequestHeaders(body.requestHeaders, 'set'),
                }
              : {}),
            responseHeaders: [
              {
                header: 'Access-Control-Allow-Origin',
                operation: 'set',
                value: '*',
              },
              {
                header: 'Access-Control-Allow-Methods',
                operation: 'set',
                value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              },
              {
                header: 'Access-Control-Allow-Headers',
                operation: 'set',
                value: '*',
              },
              ...mapHeadersToDeclarativeNetRequestHeaders(body.responseHeaders ?? {}, 'set'),
            ],
          },
        },
      ],
    });
  } else {
    // Firefox
    await (browserAPI.declarativeNetRequest as any).updateDynamicRules({
      removeRuleIds: [body.ruleId],
      addRules: [
        {
          id: body.ruleId,
          condition: {
            ...(body.targetDomains && { requestDomains: body.targetDomains }),
            ...(body.targetRegex && { regexFilter: body.targetRegex }),
          },
          action: {
            type: 'modifyHeaders',
            ...(body.requestHeaders && Object.keys(body.requestHeaders).length > 0
              ? {
                  requestHeaders: mapHeadersToDeclarativeNetRequestHeaders(body.requestHeaders, 'set'),
                }
              : {}),
            responseHeaders: [
              {
                header: 'Access-Control-Allow-Origin',
                operation: 'set',
                value: '*',
              },
              {
                header: 'Access-Control-Allow-Methods',
                operation: 'set',
                value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              },
              {
                header: 'Access-Control-Allow-Headers',
                operation: 'set',
                value: '*',
              },
              ...mapHeadersToDeclarativeNetRequestHeaders(body.responseHeaders ?? {}, 'set'),
            ],
          },
        },
      ],
    });
  }

  if (browserAPI.runtime.lastError?.message) {
    throw new Error(browserAPI.runtime.lastError.message);
  }
};

export const removeDynamicRules = async (ruleIds: number[]) => {
  const browserAPI = getBrowserAPI();
  await (browserAPI.declarativeNetRequest as any).updateDynamicRules({
    removeRuleIds: ruleIds,
  });
  if (browserAPI.runtime.lastError?.message) {
    throw new Error(browserAPI.runtime.lastError?.message ?? 'Unknown error');
  }
};
