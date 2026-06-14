// Normalize login input while keeping:
// - UserId like: BBS0001 (letters + digits)
// - Email like: name@example.com
// - Mobile like: ০১৮১২৩৪৫৬৭৮ (Bangla digits -> English digits)
//
// Rule:
// - If input contains @ or letters (A-Z/a-z) => do NOT remove non-digits.
// - If input is numeric-only (after converting Bangla digits) => keep digits and maxLen.

function enforceLoginUserDigits(el, maxLen) {
  try {
    if (!el) return;
    const raw = el.value || '';

    // Convert Bangla digits (০-৯) -> English (0-9)
    const map = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    const en = raw.replace(/[০-৯]/g, d => map[d] ?? d);

    const hasAt = en.includes('@');
    const hasLetters = /[A-Za-z]/.test(en);

    // Email or alphanumeric userId: keep as-is (except Bangla->English digits above)
    if (hasAt || hasLetters) {
      if (en !== raw) el.value = en;
      return;
    }

    // Numeric-only: keep digits and enforce maxLen
    const digitsOnly = en.replace(/\D/g, '');
    const trimmed = (typeof maxLen === 'number' && maxLen > 0)
      ? digitsOnly.slice(0, maxLen)
      : digitsOnly;

    if (trimmed !== raw) {
      el.value = trimmed;
    }
  } catch (e) {
    // no-op
  }
}

window.enforceLoginUserDigits = enforceLoginUserDigits;


