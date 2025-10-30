# Safari Extension Support

LIMITATIONS:
Due to webkit's declarative net request API not being fully featured, the extension CANNOT make requests with custom headers. This is a limitation on Safari's end. This means that the Safari extension will only unlock a few sources that are IP locked but not referrer locked. It can however bypass cors.

## Overview

This extension now supports Safari through a unified cross-platform build. The same `chrome-mv3` build works in Chrome and Safari (including Orion browser).

## Building for All Platforms

Build the extension for all platforms:

```bash
pnpm build
```

## Safari Installation & Testing

### 1. Load Extension in Safari

1. Build the extension: `pnpm build`
2. Open Safari and go to Safari → Preferences → Advanced
3. Check "Show Develop menu in menu bar"
4. Go to Develop → Allow Unsigned Extensions (for development)
5. Go to Safari → Preferences → Extensions
6. Click the "+" button and select the `build/chrome-mv3-prod` folder. Yes, it's a chrome build but it will work.

### 2. Grant Permissions

Safari requires manual permission setup:

1. **Enable Extension**: Safari → Preferences → Extensions → Enable "P-Stream extension"
2. **Website Access**: Safari → Preferences → Websites → P-Stream extension → Set to "Allow on all websites"
3. **Reload Pages**: Refresh any streaming website where you want to use the extension

### 3. Common Safari Issues & Fixes

#### Issue: "Invalid call to runtime.connect()"

**Fix**: This occurs when the background script isn't ready. The extension now includes:

- Delayed messaging setup for Safari
- Retry logic for failed connections
- Better error handling

#### Issue: WebSocket Connection Blocked

**Fix**: Safari blocks WebSocket connections for security. The extension automatically detects Safari and applies appropriate delays and retry logic.

#### Issue: Permissions Not Working

**Fix**:

- Ensure both `host_permissions` and `optional_host_permissions` are in manifest
- Guide users through Safari's manual permission setup
- Check permissions through Safari Preferences, not runtime API

### 4. Safari-Specific Behavior

- **No header modifications** As of 2025, webkit's declarative net request API is "unfinished" and you cannot change headers reliably. Due to this, most sources will not work. 
- **No Runtime Permission Requests**: Safari doesn't support `chrome.permissions.request()` - users must enable manually
- **Different Timing**: Safari background scripts load differently - we added delays and retry logic
- **Security Policies**: Safari blocks insecure content more aggressively than Chrome
- **Manifest Differences**: Safari requires `host_permissions` for proper website access

