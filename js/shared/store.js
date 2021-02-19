const INITIAL_STORED = {
  engine: 'baidu',
  open: 'new-tab',
  exact: 'no',
};

/**
 * Read data stored in chrome storage
 * @param {Function} callback 
 */
function getStored(callback) {
  chrome.storage.sync.get(INITIAL_STORED, callback);
}

/**
 * Update data stored in chrome storage
 * @param {Object} data
 */
function setStored(data) {
  chrome.storage.sync.set(data);
}
