const CONSENT_KEY = "4leafx_ads_consent";
const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7970370189900466";

function readConsent() {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored) {
      return stored;
    }
  } catch {
    // Fall back to the cookie below.
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_KEY}=([^;]*)`));
  if (match) {
    return decodeURIComponent(match[1]);
  }

  return null;
}

function writeConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Ignore storage failures and keep the page functional.
  }

  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function loadAdsense() {
  if (document.querySelector('script[data-4leafx-adsense="true"]')) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = ADSENSE_SRC;
  script.setAttribute("data-4leafx-adsense", "true");
  document.head.appendChild(script);
}

function createButton(label, variant, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button small ${variant}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function showBanner() {
  if (document.querySelector(".cookie-banner")) {
    return;
  }

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML =
    "<p>4leafx uses essential cookies for site functions and advertising cookies to support the site. Choose whether to allow ad cookies.</p>";

  const actions = document.createElement("div");
  actions.className = "cookie-banner-actions";
  actions.appendChild(
    createButton("Reject", "ghost", () => {
      writeConsent("rejected");
      banner.remove();
    }),
  );
  actions.appendChild(
    createButton("Accept", "primary", () => {
      writeConsent("accepted");
      loadAdsense();
      banner.remove();
    }),
  );

  banner.appendChild(actions);
  document.body.appendChild(banner);
}

document.addEventListener("DOMContentLoaded", () => {
  const consent = readConsent();
  if (consent === "accepted") {
    loadAdsense();
    return;
  }

  if (consent === "rejected") {
    return;
  }

  showBanner();
});
