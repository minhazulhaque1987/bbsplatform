// js/appOptimizer.js - NEW FILE
const AppCache = {
  _cache: new Map(),
  _ttl: new Map(),
  
  set(key, value, ttlMs = 300000) { // Default 5 min TTL
    this._cache.set(key, value);
    this._ttl.set(key, Date.now() + ttlMs);
  },
  
  get(key) {
    const ttl = this._ttl.get(key);
    if (ttl && Date.now() > ttl) {
      this._cache.delete(key);
      this._ttl.delete(key);
      return null;
    }
    return this._cache.get(key);
  },
  
  has(key) {
    return this.get(key) !== null;
  },
  
  delete(key) {
    this._cache.delete(key);
    this._ttl.delete(key);
  },
  
  clear() {
    this._cache.clear();
    this._ttl.clear();
  }
};

const AppOptimizer = {
  // Batch database updates
  async batchUpdate(updates) {
    const batch = [];
    for (const [userId, data] of Object.entries(updates)) {
      batch.push(window.DB.saveUser(userId, data));
    }
    return await Promise.all(batch);
  },
  
  // Debounce function for search
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Lazy load images
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => observer.observe(img));
  }
};

// Expose globally
window.AppCache = AppCache;
window.AppOptimizer = AppOptimizer;