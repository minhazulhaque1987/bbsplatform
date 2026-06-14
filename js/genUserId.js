/* Generate user ID */
function genUserId(name) {
  // We use a combination of random and timestamp to ensure uniqueness
  // Sequential IDs (BBS0001) are prone to collisions in a multi-user environment
  const prefix = 'BBS';
  const random = Math.floor(1000 + Math.random() * 9000); // 4 random digits
  const ts = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `${prefix}${ts}${random}`;
}

// Expose globally
window.genUserId = genUserId;
