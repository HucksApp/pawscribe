class DataQueueCache {
  static setDataQueue(key, dataQueue, ttl) {
    const now = new Date();
    const item = {
      dataQueue,
      expiry: now.getTime() + ttl, // TTL in milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static getDataQueue(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.dataQueue;
  }

  static clearDataQueue(key) {
    localStorage.removeItem(key);
  }

  static clearAllDataQueues(prefix) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Optional: A helper function for clearing expired caches automatically
  static clearExpiredDataQueues() {
    Object.keys(localStorage).forEach(key => {
      const itemStr = localStorage.getItem(key);
      if (itemStr) {
        const item = JSON.parse(itemStr);
        const now = new Date();
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
        }
      }
    });
  }
}

export default DataQueueCache;
