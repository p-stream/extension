const manifest = {
  host_permissions: ['<all_urls>'],
  permissions: ['storage', 'declarativeNetRequest', 'activeTab', 'cookies'],
  web_accessible_resources: [
    {
      resources: ['assets/active.png', 'assets/inactive.png'],
      matches: ['<all_urls>']
    }
  ]
}

export default manifest
