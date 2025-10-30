import { useCallback } from 'react';

import { Button } from '~components/Button';
import { Icon } from '~components/Icon';
import { usePermission } from '~hooks/usePermission';
import { isSafari } from '~utils/extension';

import '../tabs/PermissionRequest.css';

function Card(props: { purple?: boolean; children: React.ReactNode; icon?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className={['card', props.purple ? 'purple' : ''].join(' ')}>
      <div>
        <div className="icon-circle">{props.icon}</div>
      </div>
      <div>{props.children}</div>
      {props.right ? <div className="center-y">{props.right}</div> : null}
    </div>
  );
}

export default function SafariPermissionGuide() {
  const { grantPermission } = usePermission();

  const handleSafariSetup = useCallback(() => {
    if (isSafari()) {
      grantPermission().then(() => {
        // Check if permissions were granted
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  }, [grantPermission]);

  if (!isSafari()) {
    return null;
  }

  return (
    <div className="container permission-request">
      <div className="inner-container">
        <h1 className="color-white">Safari Setup Required</h1>
        <p className="text-color paragraph">
          Safari extensions require manual setup. Please follow these steps to enable the P-Stream extension:
        </p>

        <div className="card-list" style={{ marginTop: '2.5rem' }}>
          <Card icon={<Icon name="shield" />} purple>
            <div>
              <h3 className="card-title">Step 1: Enable Extension</h3>
              <p className="card-description">
                Open Safari → Preferences → Extensions, then enable &quot;P-Stream extension&quot;
              </p>
            </div>
          </Card>

          <Card icon={<Icon name="network" />}>
            <div>
              <h3 className="card-title">Step 2: Grant Website Access</h3>
              <p className="card-description">
                Go to Safari → Preferences → Websites → P-Stream extension → Set to &quot;Allow on all websites&quot; or
                add specific sites
              </p>
            </div>
          </Card>

          <Card icon={<Icon name="power" />}>
            <div>
              <h3 className="card-title">Step 3: Reload Pages</h3>
              <p className="card-description">Reload any streaming website pages where you want to use the extension</p>
            </div>
          </Card>
        </div>

        <div className="button-spacing">
          <Button onClick={handleSafariSetup}>Test Extension Setup</Button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <p className="text-color paragraph" style={{ fontSize: '0.9rem' }}>
            <strong>Note:</strong> Safari handles extension permissions differently than Chrome. These steps are
            required for the extension to work properly with streaming websites.
          </p>
        </div>
      </div>
    </div>
  );
}
