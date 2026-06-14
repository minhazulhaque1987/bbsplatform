// js/errorHandler.js - NEW FILE
window.ErrorHandler = {
  ERROR_TYPES: {
    NETWORK: 'network',
    DATABASE: 'database', 
    AUTH: 'auth',
    VALIDATION: 'validation',
    UNKNOWN: 'unknown'
  },
  
  ERROR_MESSAGES_BN: {
    network: 'ইন্টারনেট সংযোগ সমস্যা হয়েছে',
    database: 'ডাটাবেস সংরক্ষণ ব্যর্থ হয়েছে',
    auth: 'লগইন ব্যর্থ হয়েছে',
    validation: 'সঠিক তথ্য প্রদান করুন',
    unknown: 'কিছু একটা সমস্যা হয়েছে'
  },
  
  handle(error, context = '') {
    const errorType = this.classifyError(error);
    const message = this.ERROR_MESSAGES_BN[errorType] || this.ERROR_MESSAGES_BN.unknown;
    
    console.error(`[${context}] ${errorType}:`, error.message || error);
    
    if (window.toast) {
      window.toast(message, 'err');
    }
    
    return {
      type: errorType,
      message: message,
      original: error
    };
  },
  
  classifyError(error) {
    if (!error) return this.ERROR_TYPES.UNKNOWN;
    
    const msg = (error.message || '').toLowerCase();
    
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('offline')) {
      return this.ERROR_TYPES.NETWORK;
    }
    if (msg.includes('database') || msg.includes('permission') || msg.includes('firebase')) {
      return this.ERROR_TYPES.DATABASE;
    }
    if (msg.includes('auth') || msg.includes('login') || msg.includes('password')) {
      return this.ERROR_TYPES.AUTH;
    }
    if (msg.includes('validation') || msg.includes('required') || msg.includes('invalid')) {
      return this.ERROR_TYPES.VALIDATION;
    }
    
    return this.ERROR_TYPES.UNKNOWN;
  }
};

// Global error handler
window.addEventListener('error', (event) => {
  if (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK') {
    console.error('Resource load error:', event.target.src || event.target.href);
    window.ErrorHandler.handle(event.error, 'ResourceLoad');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  window.ErrorHandler.handle(event.reason, 'UnhandledPromise');
});