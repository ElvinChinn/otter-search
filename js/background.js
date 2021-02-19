const CONTEXT_MENU_ID = 'otter-search-context-menu';
const ENGINE_SEARCH_URL = {
  baidu: 'https://www.baidu.com/s?ie=UTF-8&wd=',
  bing: 'https://bing.com/search?q=',
  google: 'https://www.google.com/search?ie=UTF-8&q='
};

function getCurrentTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    callback(tabs[0].id);
  });
}

function openNewTab(url) {
  chrome.tabs.create({ url });
}

function updateCurrentTab(url) {
  getCurrentTab(tabId => chrome.tabs.update(tabId, { url }));
}

function doSearch(keyword) {
  getStored(data => {
    keyword = data.exact === 'yes' ? `"${keyword}"` : keyword;

    const url = `${ENGINE_SEARCH_URL[data.engine]}${keyword}`;

    ({
      'new-tab': openNewTab,
      'current-tab': updateCurrentTab
    }[data.open](url));
  });
};

function sendMessageToContent(options) {
  getCurrentTab(tabId => chrome.tabs.sendMessage(tabId, options));
}

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  doSearch(message.keyword);
});

/**
 * Create context menu
 */
chrome.contextMenus.create({
  id: CONTEXT_MENU_ID,
  title: 'Otter Search',
  contexts: ['all']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    const { selectionText } = info;

    selectionText
      ? doSearch(selectionText)
      : sendMessageToContent({ type: MESSAGE_TYPES.SHOW_OTTER_SEARCH });
  }
})
