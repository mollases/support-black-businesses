const blackSites = {
    'google.com': true,
    'instagram.com': {
        '/hav_chane/': true
    }
}

const render = (tabId, path) => {
    chrome.browserAction.setPopup({ tabId, popup: '' });
    chrome.browserAction.setIcon({ path, tabId });
}

const onSiteChange = (tabId, uri) => {
    try {
        const url = new URL(uri)
        if(!url.protocol.startsWith('http')) {
            render(tabId,'../images/fist.png')
            return
        }
        let host = Object.keys(blackSites).find(k => url.hostname.endsWith(k))
        let exists = typeof(blackSites[host]) !== 'undefined'
        let match = exists && (blackSites[host] === true ||
            Object.keys(blackSites[host]).find(p => p === url.pathname))
        if (match) {
            render(tabId,'../images/up.png')
        } else {
            render(tabId,'../images/down.png')
        }
    } catch (e) {
        render(tabId,'../images/fist.png')
    }
}

chrome.tabs.onActivated.addListener(function (info) {
    chrome.tabs.get(info.tabId, function (change) {
      onSiteChange(info.tabId, change.url)
    });
});
chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
    onSiteChange(tabId,tab.url)
});